document.addEventListener('DOMContentLoaded', () => {
    const navList = document.getElementById('nav-list');
    const contentArea = document.getElementById('content-area');
    const currentSectionTitle = document.getElementById('current-section-title');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    // Toggle Sidebar on mobile
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    // Populate Sidebar
    labData.forEach((section, index) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<span class="icon">📄</span> ${section.title}`;
        li.dataset.index = index;
        
        li.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }

            renderSection(index);
        });

        navList.appendChild(li);
    });

    function renderSection(index) {
        const section = labData[index];
        currentSectionTitle.textContent = section.title;
        contentArea.innerHTML = ''; // Clear current content

        section.questions.forEach((q, qIndex) => {
            const delay = qIndex * 0.1;
            
            const qBlock = document.createElement('div');
            qBlock.className = 'question-block';
            qBlock.style.animationDelay = `${delay}s`;

            let htmlContent = `<div class="question-title">${q.qTitle}</div>`;
            
            if (q.answerText) {
                htmlContent += `<div class="answer-text">${q.answerText}</div>`;
            }

            if (q.codeBlocks && q.codeBlocks.length > 0) {
                q.codeBlocks.forEach(codeBlock => {
                    htmlContent += `
                        <div class="code-container">
                            <div class="code-header">
                                <span class="code-lang">${codeBlock.lang}</span>
                                <button class="copy-btn" onclick="navigator.clipboard.writeText(\`${escapeHtml(codeBlock.code)}\`)">Copy</button>
                            </div>
                            <pre><code class="language-${codeBlock.lang.toLowerCase()}">${escapeHtml(codeBlock.code)}</code></pre>
                        </div>
                    `;
                });
            }

            qBlock.innerHTML = htmlContent;
            contentArea.appendChild(qBlock);
        });
        
        // Scroll to top
        document.querySelector('.scrollable-content').scrollTop = 0;
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
});
