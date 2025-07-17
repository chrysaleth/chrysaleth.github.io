document.addEventListener('DOMContentLoaded', function () {
    fetch('ascii.json')
        .then(response => response.text())
        .then(data => {
            // Split into lines
            const lines = data.split(/\r?\n/);
            // For each line, display it vertically as a column
            let output = '';
            const maxLen = Math.max(...lines.map(line => line.length));
            for (let i = 0; i < maxLen; i++) {
                for (let j = 0; j < lines.length; j++) {
                    output += (lines[j][i] || ' ');
                }
                output += '\n';
            }
            document.getElementById('forestScene').textContent = output;
        });
});
