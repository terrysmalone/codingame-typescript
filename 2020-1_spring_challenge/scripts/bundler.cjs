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

    // Collect ranges to remove (in reverse order to maintain positions)
    const rangesToRemove = [];

    sourceFile.statements.forEach(statement => {
        // Remove import declarations entirely
        if (ts.isImportDeclaration(statement)) {
            rangesToRemove.push({ start: statement.pos, end: statement.end });
            return;
        }

        // Remove export declarations without a body (e.g., export { x, y })
        if (ts.isExportDeclaration(statement)) {
            rangesToRemove.push({ start: statement.pos, end: statement.end });
            return;
        }

        // For statements with export keyword, remove only the 'export' keyword
        if (statement.modifiers) {
            statement.modifiers.forEach(modifier => {
                if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
                    // Find the actual position of the export keyword and remove it including trailing space
                    const exportStart = modifier.pos;
                    let exportEnd = modifier.end;

                    // Check if there's a space after 'export' and include it in removal
                    if (sourceText[exportEnd] === ' ') {
                        exportEnd++;
                    }

                    rangesToRemove.push({ start: exportStart, end: exportEnd });
                }
            });
        }
    });

    // Sort ranges in reverse order so we can remove from end to start
    rangesToRemove.sort((a, b) => b.start - a.start);

    // Build result by removing the ranges
    let result = sourceText;
    for (const range of rangesToRemove) {
        result = result.substring(0, range.start) + result.substring(range.end);
    }

    // Clean up any resulting multiple blank lines (but preserve intentional spacing)
    // Remove the line entirely if it only contained an import/export
    result = result.replace(/\n\s*\n\s*\n/g, '\n\n'); // Max 2 consecutive newlines

    return result.trim();
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
