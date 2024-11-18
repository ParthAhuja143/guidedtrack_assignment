const fs = require('fs');

class DependencyResolver {
    constructor() {
        this.dependencies = new Map();
        this.inputOrder = [];
    }

    parseInputFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Split content into lines and filter out empty lines
            const lines = content.split('\n').filter(line => line.trim());
            
            // Handle empty file or file with only empty lines
            if (lines.length === 0) {
                throw new Error('No valid dependency declarations found');
            }

            for (const line of lines) {
                this.parseLine(line);
            }

        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`File not found: ${filePath}`);
            }
            throw error;
        }
    }

    parseLine(line) {
        // Updated regex to be more permissive with dependency names
        // Now only requires "depends on" to be present between library and its dependencies
        const match = line.match(/^(.+?)\s+depends\s+on\s+(.+)$/i);
        if (!match) {
            throw new Error(`Invalid line format: ${line}`);
        }

        const [, library, dependenciesStr] = match;
        
        // Handle multiple spaces between dependencies
        // Now accepts any non-whitespace character sequence as a valid dependency name
        const directDeps = dependenciesStr.trim().split(/\s+/);

        // Maintain input order
        if (!this.dependencies.has(library.trim())) {
            this.inputOrder.push(library.trim());
        }

        this.dependencies.set(library.trim(), new Set(directDeps.map(dep => dep.trim())));
    }

    getAllDependencies(library, visited = new Set()) {
        if (!this.dependencies.has(library)) {
            return new Set();
        }

        const result = new Set();
        const directDeps = this.dependencies.get(library);

        for (const dep of directDeps) {
            result.add(dep);
            if (!visited.has(dep)) {
                visited.add(dep);
                const transitiveDeps = this.getAllDependencies(dep, visited);
                transitiveDeps.forEach(d => result.add(d));
            }
        }

        return result;
    }

    generateOutput() {
        const output = [];
        for (const library of this.inputOrder) {
            const allDeps = Array.from(this.getAllDependencies(library));
            output.push(`${library} depends on ${allDeps.join(' ')}`);
        }
        return output.join('\n');
    }
}

module.exports = DependencyResolver; 