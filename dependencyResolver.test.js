const DependencyResolver = require('./dependencyResolver');
const assert = require('assert');
const fs = require('fs');

describe('DependencyResolver', () => {
    let resolver;

    beforeEach(() => {
        resolver = new DependencyResolver();
    });

    afterEach(() => {
        // Cleanup any test files
        ['test1.txt', 'test2.txt', 'test3.txt', 'test4.txt'].forEach(file => {
            try { fs.unlinkSync(file); } catch (e) { }
        });
    });

    it('should handle basic dependencies', () => {
        const input = 'X depends on Y R\nY depends on Z';
        fs.writeFileSync('test1.txt', input);
        
        resolver.parseInputFile('test1.txt');
        const output = resolver.generateOutput();
        
        assert.equal(output, 'X depends on Y Z R\nY depends on Z');
    });

    it('should handle complex dependencies', () => {
        const input = [
            'A depends on B C',
            'B depends on C E',
            'C depends on G',
            'D depends on A F',
            'E depends on F',
            'F depends on H'
        ].join('\n');

        fs.writeFileSync('test2.txt', input);
        resolver.parseInputFile('test2.txt');
        const output = resolver.generateOutput();
        
        const expected = [
            'A depends on B C G E F H',
            'B depends on C G E F H',
            'C depends on G',
            'D depends on A B C G E F H',
            'E depends on F H',
            'F depends on H'
        ].join('\n');

        assert.equal(output, expected);
    });

    it('should handle extra spaces', () => {
        const input = 'X    depends     on    Y    R\nY    depends    on    Z';
        fs.writeFileSync('test3.txt', input);
        
        resolver.parseInputFile('test3.txt');
        const output = resolver.generateOutput();
        
        assert.equal(output, 'X depends on Y Z R\nY depends on Z');
    });

    it('should handle empty lines', () => {
        const input = 'X depends on Y\n\n\nY depends on Z\n\n';
        fs.writeFileSync('test4.txt', input);
        
        resolver.parseInputFile('test4.txt');
        const output = resolver.generateOutput();
        
        assert.equal(output, 'X depends on Y Z\nY depends on Z');
    });

    it('should handle multi-character dependency names', () => {
        const input = 'Abc-123 depends on Def_456 Ghi-789';
        fs.writeFileSync('test4.txt', input);
        
        resolver.parseInputFile('test4.txt');
        const output = resolver.generateOutput();
        
        assert.equal(output, 'Abc-123 depends on Def_456 Ghi-789');
    });

    it('should handle malformed input', () => {
        const input = 'X depends Y R';
        fs.writeFileSync('test3.txt', input);
        
        assert.throws(() => {
            resolver.parseInputFile('test3.txt');
        }, /Invalid line format/);
    });

    it('should handle empty file', () => {
        fs.writeFileSync('test4.txt', '');
        
        assert.throws(() => {
            resolver.parseInputFile('test4.txt');
        }, /No valid dependency declarations found/);
    });

    it('should handle file with only empty lines', () => {
        fs.writeFileSync('test4.txt', '\n\n\n');
        
        assert.throws(() => {
            resolver.parseInputFile('test4.txt');
        }, /No valid dependency declarations found/);
    });

    it('should handle non-existent file', () => {
        assert.throws(() => {
            resolver.parseInputFile('nonexistent.txt');
        }, /File not found/);
    });

    it('should handle special characters in dependency names', () => {
        const input = [
            'X@2.0 depends on Y#1.0 Z$3.0',
            'Y#1.0 depends on Z$3.0',
            'package@latest depends on jquery@3.6.0 lodash@4.17.21'
        ].join('\n');
        
        fs.writeFileSync('test4.txt', input);
        resolver.parseInputFile('test4.txt');
        const output = resolver.generateOutput();
        
        const expected = [
            'X@2.0 depends on Y#1.0 Z$3.0',
            'Y#1.0 depends on Z$3.0',
            'package@latest depends on jquery@3.6.0 lodash@4.17.21'
        ].join('\n');
        
        assert.equal(output, expected);
    });

    it('should handle dependency names with special characters', () => {
        const input = 'X@version depends on Y@1.0 Z#beta';
        fs.writeFileSync('test4.txt', input);
        
        resolver.parseInputFile('test4.txt');
        const output = resolver.generateOutput();
        
        assert.equal(output, 'X@version depends on Y@1.0 Z#beta');
    });
}); 