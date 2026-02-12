const state = {
    personal: {},
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: []
};

function init() {
    setupEventListeners();
    addSkillCategory('Core Competencies');
    updatePreview();
}

function setupEventListeners() {
    const inputs = ['fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location', 'summary', 'portfolio'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                state.personal[id] = e.target.value;
                updatePreview();
            });
        }
    });

    document.getElementById('exportJson').addEventListener('click', exportToJson);
    document.getElementById('importJson').addEventListener('click', () => document.getElementById('jsonInput').click());
    document.getElementById('jsonInput').addEventListener('change', importFromJson);
    document.getElementById('printResume').addEventListener('click', () => window.print());
    document.getElementById('exportDocx').addEventListener('click', exportToDocx);
}

function addItem(type) {
    const id = Date.now();
    const item = { id };
    if (type === 'experience') {
        item.company = ''; item.role = ''; item.dates = ''; item.location = ''; item.description = '';
        state.experience.push(item);
        renderExperienceItem(item);
    } else if (type === 'education') {
        item.school = ''; item.degree = ''; item.dates = ''; item.grade = '';
        state.education.push(item);
        renderEducationItem(item);
    } else if (type === 'certification') {
        item.name = '';
        state.certifications.push(item);
        renderCertificationItem(item);
    } else if (type === 'project') {
        item.name = ''; item.description = '';
        state.projects.push(item);
        renderProjectItem(item);
    }
    updatePreview();
}

// Rendering helpers for Editor UI
function renderExperienceItem(item) {
    const container = document.getElementById('experience-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `exp-${item.id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('experience', ${item.id})"><i data-lucide="trash-2"></i></button>
        <div class="grid">
            <div class="form-group"><label>Company</label><input type="text" value="${item.company}" oninput="updateItem('experience', ${item.id}, 'company', this.value)"></div>
            <div class="form-group"><label>Role</label><input type="text" value="${item.role}" oninput="updateItem('experience', ${item.id}, 'role', this.value)"></div>
            <div class="form-group"><label>Dates</label><input type="text" value="${item.dates}" oninput="updateItem('experience', ${item.id}, 'dates', this.value)"></div>
            <div class="form-group"><label>Location</label><input type="text" value="${item.location}" oninput="updateItem('experience', ${item.id}, 'location', this.value)"></div>
            <div class="form-group full-width"><label>Description</label><textarea oninput="updateItem('experience', ${item.id}, 'description', this.value)" rows="3">${item.description}</textarea></div>
        </div>
    `;
    container.appendChild(div);
    lucide.createIcons();
}

function renderEducationItem(item) {
    const container = document.getElementById('education-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `edu-${item.id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('education', ${item.id})"><i data-lucide="trash-2"></i></button>
        <div class="grid">
            <div class="form-group"><label>School</label><input type="text" value="${item.school}" oninput="updateItem('education', ${item.id}, 'school', this.value)"></div>
            <div class="form-group"><label>Degree</label><input type="text" value="${item.degree}" oninput="updateItem('education', ${item.id}, 'degree', this.value)"></div>
            <div class="form-group"><label>Dates</label><input type="text" value="${item.dates}" oninput="updateItem('education', ${item.id}, 'dates', this.value)"></div>
            <div class="form-group"><label>Grade</label><input type="text" value="${item.grade}" oninput="updateItem('education', ${item.id}, 'grade', this.value)"></div>
        </div>
    `;
    container.appendChild(div);
    lucide.createIcons();
}

function renderCertificationItem(item) {
    const container = document.getElementById('certification-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `cert-${item.id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('certification', ${item.id})"><i data-lucide="trash-2"></i></button>
        <input type="text" value="${item.name}" oninput="updateItem('certification', ${item.id}, 'name', this.value)" placeholder="Certification Name">
    `;
    container.appendChild(div);
    lucide.createIcons();
}

function renderProjectItem(item) {
    const container = document.getElementById('project-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `proj-${item.id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('project', ${item.id})"><i data-lucide="trash-2"></i></button>
        <div class="form-group"><label>Name</label><input type="text" value="${item.name}" oninput="updateItem('project', ${item.id}, 'name', this.value)"></div>
        <div class="form-group"><label>Description</label><textarea oninput="updateItem('project', ${item.id}, 'description', this.value)" rows="2">${item.description}</textarea></div>
    `;
    container.appendChild(div);
    lucide.createIcons();
}

function addSkillCategory(name = '') {
    const id = Date.now();
    const category = { id, name, skills: [] };
    state.skills.push(category);
    addSkillCategoryFromData(category);
}

function addSkillCategoryFromData(cat) {
    const container = document.getElementById('skills-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item skill-category';
    div.id = `skill-cat-${cat.id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('skills', ${cat.id})"><i data-lucide="trash-2"></i></button>
        <div class="form-group"><label>Category</label><input type="text" value="${cat.name}" oninput="updateSkillCategory(${cat.id}, this.value)"></div>
        <div class="form-group"><label>Skills (Comma separated)</label><input type="text" value="${cat.skills.join(', ')}" oninput="updateSkills(${cat.id}, this.value)"></div>
    `;
    container.appendChild(div);
    lucide.createIcons();
}

function updateItem(type, id, field, value) {
    const item = state[type].find(i => i.id === id);
    if (item) item[field] = value;
    updatePreview();
}

function updateSkillCategory(id, value) {
    const cat = state.skills.find(c => c.id === id);
    if (cat) cat.name = value;
    updatePreview();
}

function updateSkills(id, value) {
    const cat = state.skills.find(c => c.id === id);
    if (cat) cat.skills = value.split(',').map(s => s.trim()).filter(s => s !== '');
    updatePreview();
}

function removeItem(type, id) {
    state[type] = state[type].filter(i => i.id !== id);
    const prefix = { experience: 'exp-', education: 'edu-', certification: 'cert-', project: 'proj-', skills: 'skill-cat-' }[type];
    const el = document.getElementById(`${prefix}${id}`);
    if (el) el.remove();
    updatePreview();
}

// Icon Helper
const getIcon = (name) => `<i data-lucide="${name}"></i>`;

function updatePreview() {
    const preview = document.getElementById('resume-preview');
    const { personal, experience, education, skills, certifications, projects } = state;

    if (!personal.fullName && experience.length === 0 && education.length === 0) {
        preview.innerHTML = `<div class="preview-placeholder"><i data-lucide="eye" size="48"></i><p>Enter details for live preview</p></div>`;
        lucide.createIcons();
        return;
    }

    // Name Typography: Bold First/Middle, Thin Last
    let nameHtml = personal.fullName || 'YOUR NAME';
    if (personal.fullName) {
        const parts = personal.fullName.split(' ');
        if (parts.length > 1) {
            const last = parts.pop();
            nameHtml = `<span class="first-name">${parts.join(' ')}</span><span class="last-name">${last}</span>`;
        } else {
            nameHtml = `<span class="first-name">${personal.fullName}</span>`;
        }
    }

    let html = `
        <div class="resume-header">
            <div class="name-container">${nameHtml}</div>
            <div class="job-title">${personal.jobTitle || ''}</div>
            <div class="contact-bar">
                ${personal.phone ? `<div class="contact-item">${getIcon('phone')} ${personal.phone}</div>` : ''}
                ${personal.email ? `<div class="contact-item">${getIcon('mail')} ${personal.email}</div>` : ''}
                ${personal.location ? `<div class="contact-item">${getIcon('map-pin')} ${personal.location}</div>` : ''}
                ${personal.linkedin ? `<div class="contact-item">${getIcon('linkedin')} ${personal.linkedin}</div>` : ''}
                ${personal.portfolio ? `<div class="contact-item">${getIcon('globe')} ${personal.portfolio}</div>` : ''}
            </div>
        </div>
        <div class="resume-body">
            <div class="sidebar">
                <section>
                    <span class="section-header-sidebar">Education</span>
                    ${education.map(edu => `
                        <div class="sidebar-item">
                            <div class="sidebar-item-bold">${edu.school}</div>
                            <div>${edu.degree}</div>
                            <div style="font-size: 8.5pt;">${edu.dates} ${edu.grade ? `| ${edu.grade}` : ''}</div>
                        </div>
                    `).join('')}
                </section>
                <section>
                    <span class="section-header-sidebar">Skills</span>
                    ${skills.map(cat => `
                        <div class="skill-group">
                            <span class="skill-label">${cat.name}</span>
                            <div class="skill-tags">${cat.skills.join(', ')}</div>
                        </div>
                    `).join('')}
                </section>
                <section>
                    <span class="section-header-sidebar">Certifications</span>
                    ${certifications.map(cert => `<div class="sidebar-item">${cert.name}</div>`).join('')}
                </section>
            </div>
            <div class="main-content">
                ${personal.summary ? `<section><h3>About Me</h3><p>${personal.summary}</p></section>` : ''}
                ${experience.length ? `<section><h3>Work Experience</h3>${experience.map(exp => `
                    <div class="entry">
                        <div class="entry-header"><span>${exp.company}</span><span>${exp.dates}</span></div>
                        <div class="entry-sub"><span>${exp.role}</span><span>${exp.location}</span></div>
                        <ul class="bullets">${exp.description.split('\n').filter(l => l.trim()).map(l => `<li>${l.trim()}</li>`).join('')}</ul>
                    </div>
                `).join('')}</section>` : ''}
                ${projects.length ? `<section><h3>Projects & Achievements</h3>${projects.map(p => `
                    <div class="entry">
                        <div class="sidebar-item-bold">${p.name}</div>
                        <p>${p.description}</p>
                    </div>
                `).join('')}</section>` : ''}
            </div>
        </div>
    `;

    preview.innerHTML = html;
    lucide.createIcons(); // Vital for dynamic icons in preview
}

function exportToJson() {
    saveAs(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), 'resume-data.json');
}

function importFromJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        Object.assign(state, JSON.parse(event.target.result));
        ['experience-list', 'education-list', 'certification-list', 'project-list', 'skills-list'].forEach(id => document.getElementById(id).innerHTML = '');
        const inputs = ['fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location', 'summary', 'portfolio'];
        inputs.forEach(id => { const el = document.getElementById(id); if (el) el.value = state.personal[id] || ''; });
        state.experience.forEach(renderExperienceItem);
        state.education.forEach(renderEducationItem);
        state.certifications.forEach(renderCertificationItem);
        state.projects.forEach(renderProjectItem);
        state.skills.forEach(addSkillCategoryFromData);
        updatePreview();
    };
    reader.readAsText(file);
}

async function exportToDocx() {
    try {
        if (!window.docx) { alert("DOCX library not loaded yet. Please wait."); return; }
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = window.docx;

        const children = [];

        // Header
        const nameParts = (state.personal.fullName || 'YOUR NAME').split(' ');
        const surname = nameParts.length > 1 ? nameParts.pop() : '';
        const firstName = nameParts.join(' ');

        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: firstName + " ", bold: true, size: 48 }),
                    new TextRun({ text: surname, size: 48 }),
                ]
            }),
            new Paragraph({ text: (state.personal.jobTitle || '').toUpperCase(), alignment: AlignmentType.CENTER, spacing: { before: 100 } }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun(state.personal.phone || ''),
                    new TextRun(state.personal.email ? ` | ${state.personal.email}` : ''),
                    new TextRun(state.personal.location ? ` | ${state.personal.location}` : ''),
                    new TextRun(state.personal.linkedin ? ` | ${state.personal.linkedin}` : ''),
                    new TextRun(state.personal.portfolio ? ` | ${state.personal.portfolio}` : ''),
                ],
                spacing: { after: 300 },
            })
        );

        // Sidebar + Main Content as a Table for 2-column layout in DOCX
        const sidebarChildren = [
            new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_3 }),
            ...state.education.flatMap(edu => [
                new Paragraph({ text: edu.school, bold: true, spacing: { before: 100 } }),
                new Paragraph({ text: edu.degree }),
                new Paragraph({ text: `${edu.dates} ${edu.grade ? `| ${edu.grade}` : ''}`, size: 18 }),
            ]),
            new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_3, spacing: { before: 200 } }),
            ...state.skills.flatMap(cat => [
                new Paragraph({ text: cat.name, bold: true, size: 18 }),
                new Paragraph({ text: cat.skills.join(', '), size: 18 }),
            ]),
            new Paragraph({ text: "CERTIFICATIONS", heading: HeadingLevel.HEADING_3, spacing: { before: 200 } }),
            ...state.certifications.map(cert => new Paragraph({ text: cert.name, size: 18 })),
        ];

        const mainChildren = [
            ...(state.personal.summary ? [
                new Paragraph({ text: "ABOUT ME", heading: HeadingLevel.HEADING_3 }),
                new Paragraph({ text: state.personal.summary, spacing: { after: 200 } })
            ] : []),
            ...(state.experience.length ? [
                new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_3 }),
                ...state.experience.flatMap(exp => [
                    new Paragraph({
                        children: [new TextRun({ text: exp.company, bold: true }), new TextRun({ text: `\t${exp.dates}`, bold: true })]
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: exp.role, italic: true }), new TextRun({ text: `\t${exp.location}`, italic: true })]
                    }),
                    ...exp.description.split('\n').filter(l => l.trim()).map(l => new Paragraph({ text: l.trim(), bullet: { level: 0 } })),
                    new Paragraph({ text: "", spacing: { after: 100 } })
                ])
            ] : []),
            ...(state.projects.length ? [
                new Paragraph({ text: "PROJECTS", heading: HeadingLevel.HEADING_3 }),
                ...state.projects.flatMap(p => [
                    new Paragraph({ text: p.name, bold: true }),
                    new Paragraph({ text: p.description, spacing: { after: 100 } })
                ])
            ] : [])
        ];

        const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE, insideHorizontal: BorderStyle.NONE, insideVertical: BorderStyle.NONE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, children: sidebarChildren }),
                        new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, children: mainChildren }),
                    ]
                })
            ]
        });

        children.push(table);

        const doc = new Document({ sections: [{ children }] });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "resume.docx");
    } catch (err) {
        console.error(err);
        alert("Error exporting DOCX: " + err.message);
    }
}

init();
