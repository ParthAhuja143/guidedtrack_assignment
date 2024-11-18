const DependencyResolver = require('./dependencyResolver');

function main() {
    if (process.argv.length !== 3) {
        console.error('❗️Error: Missing input file');
        console.error('Usage: node index.js <input-file>');
        process.exit(1);
    }

    const inputFile = process.argv[2];
    const resolver = new DependencyResolver();

    try {
        // Starting message
        console.log('🚀 Starting dependency resolution process...');
        
        // File reading
        console.log(`📂 Reading input file: ${inputFile}`);
        resolver.parseInputFile(inputFile);
        console.log('✅ Successfully parsed input file');
        
        // Generating output
        console.log('🔄 Generating dependency tree...');
        const output = resolver.generateOutput();
        
        // Final output
        console.log('\n📊 Resolved Dependencies:');
        console.log('------------------------');
        console.log(output);
        console.log('------------------------');
        console.log('✨ Process completed successfully');
        
    } catch (error) {
        console.error('\n❗️Error:', error.message);
        if (error.message.includes('File not found')) {
            console.error('💡 Tip: Make sure the file exists and the path is correct');
        } else if (error.message.includes('Invalid line format')) {
            console.error('💡 Tip: Each line should follow the format: "<library> depends on <dependencies>"');
        } else if (error.message.includes('No valid dependency')) {
            console.error('💡 Tip: File should contain at least one valid dependency declaration');
        }
        process.exit(1);
    }
}

if (require.main === module) {
    main();
} 