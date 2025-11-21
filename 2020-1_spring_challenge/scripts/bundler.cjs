// bundle-ts.js
const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const config = {
    entry: './src/player.ts',
    outFile: './dist/bundled-solution.ts'
};

function resolveImports(fileName, visited, orderedFiles) {
    const absolutePath = path.resolve(fileName);

    if (visited.has(absolutePath)) {
        return;
    }

    visited.add(absolutePath);

    const sourceText = fs.readFileSync(absolutePath, 'utf8');
    const sourceFile = ts.createSourceFile(
        absolutePath,
        sourceText,
        ts.ScriptTarget.Latest,
        true
    );

    // Find all import statements and resolve dependencies first
    sourceFile.statements.forEach(statement => {
        if (ts.isImportDeclaration(statement)) {
            const moduleSpecifier = statement.moduleSpecifier;
            if (ts.isStringLiteral(moduleSpecifier)) {
                const importPath = moduleSpecifier.text;

                // Only process relative imports (not node_modules)
                if (importPath.startsWith('.')) {
                    let resolvedPath = path.resolve(path.dirname(absolutePath), importPath);

                    // Try adding .ts extension if not present
                    if (!fs.existsSync(resolvedPath)) {
                        resolvedPath += '.ts';
                    }

                    if (fs.existsSync(resolvedPath)) {
                        resolveImports(resolvedPath, visited, orderedFiles);
                    }
                }
            }
        }
    });

    orderedFiles.push(absolutePath);
}

function removeImportsExports(sourceText) {
    const sourceFile = ts.createSourceFile(
        'temp.ts',
        sourceText,
        ts.ScriptTarget.Latest,
        true
    );

    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const statements = [];

    sourceFile.statements.forEach(statement => {
        // Skip import declarations entirely
        if (ts.isImportDeclaration(statement)) {
            return;
        }

        // Skip export declarations without a body (e.g., export { x, y })
        if (ts.isExportDeclaration(statement)) {
            return;
        }

        // For statements with export keyword, remove the export modifier
        if (statement.modifiers && statement.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
            const modifiers = statement.modifiers.filter(m => m.kind !== ts.SyntaxKind.ExportKeyword);
            const newStatement = ts.factory.createNodeArray(modifiers).length > 0
                ? { ...statement, modifiers: ts.factory.createNodeArray(modifiers) }
                : { ...statement, modifiers: undefined };
            statements.push(newStatement);
        } else {
            statements.push(statement);
        }
    });

    // Print the modified statements
    const result = statements.map(stmt =>
        printer.printNode(ts.EmitHint.Unspecified, stmt, sourceFile)
    ).join('\n');

    return result;
}

function bundle(config) {
    const visited = new Set();
    const orderedFiles = [];

    console.log('Starting bundle process...\n');

    // Resolve all dependencies starting from entry point
    resolveImports(config.entry, visited, orderedFiles);

    console.log(`Found ${orderedFiles.length} file(s) to bundle:`);
    orderedFiles.forEach(file => console.log(`  - ${path.relative(process.cwd(), file)}`));
    console.log('');

    // Combine all files
    let bundledContent = '// Auto-generated bundle - Do not edit directly\n\n';

    orderedFiles.forEach(file => {
        const sourceText = fs.readFileSync(file, 'utf8');
        const cleanedSource = removeImportsExports(sourceText);

        bundledContent += `// --- ${path.relative(process.cwd(), file)} ---\n`;
        bundledContent += cleanedSource;
        bundledContent += '\n\n';
    });

    // Ensure output directory exists
    const outDir = path.dirname(config.outFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Write the bundle
    fs.writeFileSync(config.outFile, bundledContent, 'utf8');
    console.log(`✓ Successfully bundled to: ${config.outFile}`);
}

// Run the bundler
try {
    bundle(config);
} catch (error) {
    console.error('Bundling failed:', error);
    process.exit(1);
}
