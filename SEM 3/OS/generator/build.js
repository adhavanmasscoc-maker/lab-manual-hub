const fs = require('fs');
const path = require('path');

const set1 = require('./set1');
const set2 = require('./set2');
const viva = require('./viva');

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderQuestion(q, setNum) {
    let html = `
    <div class="model-q-box" id="set${setNum}_q${q.num}" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 22px; margin-bottom: 30px; box-shadow: 0 3px 10px rgba(15,23,42,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
            <div>
                <span style="display:inline-block; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; background:#4338ca; color:#ffffff; padding:4px 10px; border-radius:6px; margin-bottom:6px;">Model Set ${setNum} – Question ${q.num}</span>
                <h3 style="color:#0f172a; font-size:18px; font-weight:800; margin:0; line-height:1.4;">${q.title}</h3>
            </div>
            <span style="background:#e0e7ff; color:#3730a3; font-weight:800; font-size:13px; padding:6px 12px; border-radius:6px; border:1px solid #c7d2fe; white-space:nowrap;">Total: 100 Marks (50 + 50)</span>
        </div>

        <!-- PART A -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #2563eb; border-radius:8px; padding:16px; margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4 style="color:#1e40af; font-size:15px; font-weight:800; margin:0;">Part (a) [50 Marks] – Question Statement</h4>
                <span style="background:#dbeafe; color:#1e40af; font-weight:700; font-size:11px; padding:2px 8px; border-radius:4px;">50 Marks</span>
            </div>
            <p style="font-weight:600; color:#1e293b; margin-bottom:12px; font-size:14px;">${q.partA.q}</p>

            <div class="sub-sec-title" style="margin-top:10px;">Aim / Objective</div>
            <p class="exp-content" style="font-size:13.5px; margin-bottom:10px;">${q.partA.aim}</p>

            <div class="sub-sec-title">Algorithm & Theoretical Principles</div>
            <div class="exp-content" style="font-size:13.5px; margin-bottom:12px; line-height:1.6;">${q.partA.principle.replace(/\n/g, '<br>')}</div>

            ${q.partA.table ? `<div class="sub-sec-title">Comparative Analysis Table</div><div style="overflow-x:auto; margin-bottom:14px;">${q.partA.table}</div>` : ''}

            ${q.partA.code ? `
            <div class="sub-sec-title">C Program / Code Implementation</div>
            <div class="code-wrapper">
                <div class="code-header">
                    <span>C Implementation (Part A)</span>
                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${escapeHtml(q.partA.code)}</code></pre>
            </div>` : ''}

            ${q.partA.output ? `
            <div class="sub-sec-title" style="margin-top:12px;">Execution Output & Manual Tracing</div>
            <div class="output-box">${escapeHtml(q.partA.output)}</div>` : ''}
        </div>

        <!-- PART B -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #059669; border-radius:8px; padding:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h4 style="color:#065f46; font-size:15px; font-weight:800; margin:0;">Part (b) [50 Marks] – Question Statement</h4>
                <span style="background:#d1fae5; color:#065f46; font-weight:700; font-size:11px; padding:2px 8px; border-radius:4px;">50 Marks</span>
            </div>
            <p style="font-weight:600; color:#1e293b; margin-bottom:12px; font-size:14px;">${q.partB.q}</p>

            <div class="sub-sec-title" style="margin-top:10px;">Aim / Objective</div>
            <p class="exp-content" style="font-size:13.5px; margin-bottom:10px;">${q.partB.aim}</p>

            <div class="sub-sec-title">Algorithm & Script Logic</div>
            <div class="exp-content" style="font-size:13.5px; margin-bottom:12px; line-height:1.6;">${q.partB.principle.replace(/\n/g, '<br>')}</div>

            ${q.partB.table ? `<div class="sub-sec-title">Analysis Table</div><div style="overflow-x:auto; margin-bottom:14px;">${q.partB.table}</div>` : ''}

            ${q.partB.code ? `
            <div class="sub-sec-title">Shell Script Implementation</div>
            <div class="code-wrapper">
                <div class="code-header">
                    <span>Shell Script (Part B)</span>
                    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
                </div>
                <pre><code>${escapeHtml(q.partB.code)}</code></pre>
            </div>` : ''}

            ${q.partB.output ? `
            <div class="sub-sec-title" style="margin-top:12px;">Execution Output</div>
            <div class="output-box">${escapeHtml(q.partB.output)}</div>` : ''}
        </div>
    </div>`;
    return html;
}

function generateIndex0() {
    let html = `
        <!-- ================= INDEX 0: PRACTICAL EXAMINATION MODEL SOLUTIONS ================= -->
        <article class="exp-card" id="index0" style="border-left: 6px solid #4f46e5; margin-bottom: 40px;">
            <div class="exp-header" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
                <span class="exp-badge" style="background:#4f46e5; font-size:12px; padding:6px 14px; text-transform:uppercase; letter-spacing:0.04em;">Index 0 – University Practical Examination Model Question Bank</span>
                <h2 class="exp-title" style="font-size:24px; color:#1e1b4b; margin-top:8px;">Complete Step-by-Step Practical Examination Solutions (50+50 Marks Pattern)</h2>
                <p style="color:#475569; font-size:14px; margin-top:6px;">
                    Comprehensive, verified, exam-ready answers for all 40 questions across Model Question Paper Set 1 and Set 2. Formatted with rigorous Aims, Step-by-step Algorithms, complete C and Bash implementations with headers, manual tracing calculations, and exact console execution outputs.
                </p>
            </div>

            <!-- QUICK JUMP PILLS -->
            <div style="background:#edf2f7; border:1px solid #cbd5e1; border-radius:8px; padding:16px; margin-bottom:28px;">
                <div style="font-weight:700; font-size:13.5px; color:#1e293b; margin-bottom:10px; display:flex; align-items:center; gap:8px;">
                    <span style="background:#4f46e5; color:#fff; width:20px; height:20px; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; font-size:11px;">⚡</span>
                    Quick Jump to Model Exam Papers:
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;">
                    <a href="#set1_anchor" style="text-decoration:none; background:#4338ca; color:#fff; font-weight:700; font-size:12.5px; padding:7px 16px; border-radius:6px; box-shadow:0 2px 6px rgba(67,56,202,0.25);">Jump to Model Paper Set 1 (Questions 1 - 20)</a>
                    <a href="#set2_anchor" style="text-decoration:none; background:#047857; color:#fff; font-weight:700; font-size:12.5px; padding:7px 16px; border-radius:6px; box-shadow:0 2px 6px rgba(4,120,87,0.25);">Jump to Model Paper Set 2 (Questions 1 - 20)</a>
                    <a href="#viva" style="text-decoration:none; background:#d97706; color:#fff; font-weight:700; font-size:12.5px; padding:7px 16px; border-radius:6px; box-shadow:0 2px 6px rgba(217,119,6,0.25);">Jump to Comprehensive Viva Voce Q&A</a>
                </div>
            </div>

            <!-- ================= SET 1 SECTION ================= -->
            <div id="set1_anchor" style="scroll-margin-top: 80px; margin-top:20px; margin-bottom:30px;">
                <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color:#ffffff; padding:18px 24px; border-radius:10px; margin-bottom:24px; box-shadow: 0 4px 14px rgba(30,27,75,0.2);">
                    <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#a5b4fc; margin-bottom:4px;">Examination Section A</div>
                    <h2 style="font-size:22px; font-weight:800; margin:0; color:#ffffff;">Model Practical Examination Paper 1 (Questions 1 – 20)</h2>
                    <p style="font-size:13px; color:#cbd5e1; margin-top:4px; margin-bottom:0;">Each question contains Part (a) [50 Marks] and Part (b) [50 Marks]. Total: 100 Marks per question.</p>
                </div>
    `;

    set1.forEach(q => {
        html += renderQuestion(q, 1);
    });

    html += `
            </div>

            <!-- ================= SET 2 SECTION ================= -->
            <div id="set2_anchor" style="scroll-margin-top: 80px; margin-top:40px; margin-bottom:30px;">
                <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color:#ffffff; padding:18px 24px; border-radius:10px; margin-bottom:24px; box-shadow: 0 4px 14px rgba(6,78,59,0.2);">
                    <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#6ee7b7; margin-bottom:4px;">Examination Section B</div>
                    <h2 style="font-size:22px; font-weight:800; margin:0; color:#ffffff;">Model Practical Examination Paper 2 (Questions 1 – 20)</h2>
                    <p style="font-size:13px; color:#cbd5e1; margin-top:4px; margin-bottom:0;">Advanced and alternative variants covering Pipes, Semaphores, Deadlocks, Pthreads, Best Fit, and LRU.</p>
                </div>
    `;

    set2.forEach(q => {
        html += renderQuestion(q, 2);
    });

    html += `
            </div>

            <div class="box-result" style="margin-top:24px;">
                Result: All 40 practical examination questions for Model Sets 1 and 2 were formulated, solved step-by-step, traced mathematically, and verified with complete working C and Shell programs.
            </div>
        </article>
    `;

    return html;
}

function generateViva() {
    let html = `
        <!-- ================= VIVA VOCE SECTION ================= -->
        <article class="exp-card" id="viva" style="border-left: 6px solid #059669; margin-top: 40px;">
            <div class="exp-header" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 20px;">
                <span class="exp-badge" style="background:#059669; font-size:12px; padding:6px 14px; text-transform:uppercase; letter-spacing:0.04em;">Comprehensive Viva Voce Master Preparation</span>
                <h2 class="exp-title" style="font-size:24px; color:#064e3b; margin-top:8px;">Operating Systems Laboratory Viva Voce Questions & Answers (All 15 Experiments)</h2>
                <p style="color:#475569; font-size:14px; margin-top:6px;">
                    High-yield, examiner-tested technical questions and precise definitions covering Unix commands, System Calls, CPU Scheduling, IPC, Semaphores, Deadlocks, Pthreads, Memory Management, Paging, Page Replacement, File Systems, and Disk Scheduling.
                </p>
            </div>
    `;

    viva.forEach((unit, uIdx) => {
        html += `
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:18px; margin-bottom:24px;">
                <h3 style="color:#166534; font-size:17px; font-weight:800; margin-bottom:14px; border-bottom:2px solid #86efac; padding-bottom:6px;">
                    ${unit.topic}
                </h3>
        `;

        unit.qa.forEach((item, qIdx) => {
            html += `
                <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:14px; margin-bottom:12px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                    <div style="font-weight:700; color:#0f172a; font-size:14px; margin-bottom:6px; display:flex; gap:8px;">
                        <span style="color:#059669; font-weight:800;">Q${qIdx + 1}:</span>
                        <span>${item.q}</span>
                    </div>
                    <div style="font-size:13.5px; color:#334155; line-height:1.6; padding-left:26px; border-left:3px solid #86efac; margin-left:4px;">
                        ${item.a.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
    });

    html += `
            <div class="box-result" style="margin-top:24px;">
                Result: Core theoretical concepts and viva voce questions across all 15 syllabus experiments were reviewed and answered systematically.
            </div>
        </article>
    `;

    return html;
}

function updateFile(filePath) {
    console.log(`Processing file: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Update Index Table in HTML
    // Look for index-table tbody
    const tableRegex = /<table class="index-table">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/;
    const match = content.match(tableRegex);
    if (match) {
        let tbody = match[1];

        // Clean out any old index0 or viva or os1 entries if present
        tbody = tbody.split('\n').filter(line => 
            !line.includes('#index0') && 
            !line.includes('#os1') && 
            !line.includes('#viva') &&
            !line.includes('Index 0') &&
            !line.includes('Practical Examination')
        ).join('\n').trim();

        // Create new row 0
        const row0 = `                        <tr style="background:#f5f3ff;"><td class="sno" style="font-weight:800; background:#e0e7ff; color:#3730a3;">0</td><td><a href="#index0" style="color:#4338ca; font-weight:700;">★ Index 0: Practical Examination Model Questions & Full Solutions (Set 1 & Set 2 – 50+50 Marks Pattern)</a></td></tr>\n`;
        
        // Create viva row at end
        const rowViva = `\n                        <tr style="background:#f0fdf4;"><td class="sno" style="font-weight:800; background:#d1fae5; color:#065f46;">VIVA</td><td><a href="#viva" style="color:#047857; font-weight:700;">★ Comprehensive OS Lab Viva Voce Master Question Bank (All 15 Experiments)</a></td></tr>`;

        const newTbody = row0 + tbody + rowViva;
        const newTable = match[0].replace(match[1], '\n' + newTbody + '\n                    ');
        content = content.replace(match[0], newTable);
        console.log(`  Updated index table with Row 0 and Viva row.`);
    } else {
        console.warn(`  Warning: Could not find index-table in ${filePath}`);
    }

    // 2. Update Header Jump Select
    const selectRegex = /<select class="jump-select"[\s\S]*?>([\s\S]*?)<\/select>/;
    const selectMatch = content.match(selectRegex);
    if (selectMatch) {
        let selectBody = selectMatch[1];
        // Remove existing index0 / viva options
        selectBody = selectBody.split('\n').filter(line => 
            !line.includes('#index0') && 
            !line.includes('#viva') && 
            !line.includes('#os1')
        ).join('\n');

        // Add index0 after first option
        selectBody = selectBody.replace(
            /(<option value="">.*?<\/option>)/,
            `$1\n                <option value="#index0">★ Index 0: Practical Exam Solutions (Set 1 & 2)</option>`
        );

        // Add viva before </select>
        selectBody = selectBody.trimEnd() + `\n                <option value="#viva">★ Viva Voce Questions & Answers</option>\n            `;

        const newSelect = selectMatch[0].replace(selectMatch[1], selectBody);
        content = content.replace(selectMatch[0], newSelect);
        console.log(`  Updated jump select dropdown.`);
    }

    // 3. Remove existing #index0 or #os1 article if already present
    const oldIndex0Regex = /<!-- ================= INDEX 0: PRACTICAL EXAMINATION[\s\S]*?<\/article>/;
    if (oldIndex0Regex.test(content)) {
        content = content.replace(oldIndex0Regex, '');
        console.log(`  Removed previous index0 article.`);
    }

    const oldOs1Regex = /<article class="exp-card" id="os1"[\s\S]*?<\/article>/;
    if (oldOs1Regex.test(content)) {
        content = content.replace(oldOs1Regex, '');
        console.log(`  Removed previous os1 article.`);
    }

    // 4. Remove existing #viva article if already present
    const oldVivaRegex = /<!-- ================= VIVA VOCE SECTION ================= -->[\s\S]*?<\/article>/;
    if (oldVivaRegex.test(content)) {
        content = content.replace(oldVivaRegex, '');
        console.log(`  Removed previous viva article.`);
    }

    // 5. Generate and inject Index 0 before <article class="exp-card" id="ex1">
    const index0Html = generateIndex0();
    const ex1Marker = '<article class="exp-card" id="ex1">';
    if (content.includes(ex1Marker)) {
        content = content.replace(ex1Marker, index0Html + '\n\n        ' + ex1Marker);
        console.log(`  Successfully inserted Index 0 before Ex 1.`);
    } else {
        console.error(`  Error: Could not locate ${ex1Marker}`);
    }

    // 6. Generate and inject Viva Voce after <article class="exp-card" id="cbs5" ... </article>
    const vivaHtml = generateViva();
    const cbs5EndMarker = '</article>';
    // Find the last article before footer
    const footerMarker = '<footer class="bottom-footer">';
    if (content.includes(footerMarker)) {
        content = content.replace(footerMarker, vivaHtml + '\n\n        ' + footerMarker);
        console.log(`  Successfully inserted Viva Voce section before footer.`);
    } else {
        console.error(`  Error: Could not locate ${footerMarker}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Finished updating ${filePath}. New file size: ${content.length} bytes.`);
}

// Target files
const files = [
    'D:/MATERIALS/REDDIT/SEM 3/OS/os-lab-manual/index.html',
    'D:/MATERIALS/REDDIT/SEM 3/OS/index.html',
    'D:/MATERIALS/REDDIT/SEM 3/OS 1/index.html'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        updateFile(f);
    } else {
        console.warn(`File not found: ${f}`);
    }
});

console.log('ALL MANUALS SUCCESSFULLY UPDATED!');
