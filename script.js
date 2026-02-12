const state = {
    personal: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        linkedin: '',
        location: '',
        summary: '',
        portfolio: '',
        roles: '',
        declaration: 'I hereby declare that the above written particulars are true to the best of my knowledge and belief.',
        place: 'Hyderabad',
        date: '',
        preferredName: ''
    },
    experience: [],
    education: [],
    skills: [],
    softSkills: '',
    languages: '',
    hobbies: '',
    certifications: [],
    projects: []
};

function init() {
    setupEventListeners();
    addSkillCategory('Technical Skills');
    updatePreview();
}

function setupEventListeners() {
    const inputs = [
        'fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location',
        'summary', 'portfolio', 'roles', 'declaration', 'place', 'date',
        'preferredName', 'softSkills', 'languages', 'hobbies'
    ];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                const val = e.target.value;
                if (['softSkills', 'languages', 'hobbies'].includes(id)) {
                    state[id] = val;
                } else {
                    state.personal[id] = val;
                }
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

function renderExperienceItem(item) {
    const container = document.getElementById('experience-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.id = `exp-${item.id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('experience', ${item.id})"><i data-lucide="trash-2"></i></button>
        <div class="grid">
            <div class="form-group"><label>Company</label><input type="text" value="${item.company}" oninput="updateItem('experience', ${item.id}, 'company', this.value)"></div>
            <div class="form-group"><label>Dates</label><input type="text" value="${item.dates}" oninput="updateItem('experience', ${item.id}, 'dates', this.value)"></div>
            <div class="form-group"><label>Role</label><input type="text" value="${item.role}" oninput="updateItem('experience', ${item.id}, 'role', this.value)"></div>
            <div class="form-group"><label>Location</label><input type="text" value="${item.location}" oninput="updateItem('experience', ${item.id}, 'location', this.value)"></div>
            <div class="form-group full-width"><label>Description (Markdown bullets supported)</label><textarea oninput="updateItem('experience', ${item.id}, 'description', this.value)" rows="3">${item.description}</textarea></div>
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
            <div class="form-group"><label>Dates</label><input type="text" value="${item.dates}" oninput="updateItem('education', ${item.id}, 'dates', this.value)"></div>
            <div class="form-group"><label>Degree</label><input type="text" value="${item.degree}" oninput="updateItem('education', ${item.id}, 'degree', this.value)"></div>
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

function updatePreview() {
    const preview = document.getElementById('resume-preview');
    const { personal, experience, education, skills, certifications, projects, softSkills, languages, hobbies } = state;

    if (!personal.fullName && experience.length === 0 && education.length === 0) {
        preview.innerHTML = `<div class="preview-placeholder"><i data-lucide="eye" size="48"></i><p>Enter details for live preview</p></div>`;
        lucide.createIcons();
        return;
    }

    // Header Construction
    let contactLines = [];
    if (personal.email || personal.phone) {
        contactLines.push(`${personal.email || ''}${personal.email && personal.phone ? ' &nbsp;&nbsp;&nbsp;&nbsp; ' : ''}${personal.phone || ''}`);
    }
    if (personal.linkedin || personal.location || personal.portfolio) {
        const parts = [personal.linkedin, personal.location, personal.portfolio].filter(Boolean);
        contactLines.push(parts.join(' &nbsp;&nbsp;&nbsp; '));
    }

    let rolesHtml = '';
    if (personal.roles) {
        const rolesList = personal.roles.split(',').map(r => r.trim()).filter(Boolean);
        if (rolesList.length) {
            rolesHtml = `<div class="roles-bar">|| ${rolesList.join(' || ')} ||</div>`;
        }
    }

    let html = `
        <div class="resume-header">
            <div class="name-container">${(personal.fullName || 'YOUR NAME').toUpperCase()}</div>
            <div class="contact-bar">
                ${contactLines.map(line => `<div>${line}</div>`).join('')}
            </div>
            ${rolesHtml}
        </div>

        <section>
            <h3>Professional Summary</h3>
            <p>${personal.summary || ''}</p>
        </section>

        <section>
            <h3>Work Experience</h3>
            ${experience.map(exp => `
                <div class="entry">
                    <div class="entry-header"><span>${exp.company}</span><span>${exp.dates}</span></div>
                    <div class="entry-sub"><span>${exp.role}</span><span>${exp.location}</span></div>
                    <ul class="bullets">
                        ${exp.description.split('\n').filter(l => l.trim()).map(l => `<li>${l.trim()}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </section>

        <section>
            <h3>Projects & Achievements</h3>
            <ul class="bullets">
                ${projects.map(p => `<li><span style="font-weight:bold">${p.name}:</span> ${p.description}</li>`).join('')}
            </ul>
        </section>

        <section>
            <h3>Technical Skills</h3>
            ${skills.map(cat => `
                <div class="skill-line">
                    <span class="skill-name">${cat.name}:</span> ${cat.skills.join(', ')}
                </div>
            `).join('')}
        </section>

        ${softSkills ? `<section><h3>Soft Skills</h3><p>${softSkills}</p></section>` : ''}
        ${languages ? `<section><h3>Languages</h3><p>${languages}</p></section>` : ''}

        <section>
            <h3>Certifications</h3>
            <ul class="bullets">
                ${certifications.map(cert => `<li>${cert.name}</li>`).join('')}
            </ul>
        </section>

        ${hobbies ? `<section><h3>Interests & Hobbies</h3><ul class="bullets">${hobbies.split(',').map(h => `<li>${h.trim()}</li>`).join('')}</ul></section>` : ''}

        <section>
            <h3>Education</h3>
            ${education.map(edu => `
                <div class="entry">
                    <div class="entry-header"><span>${edu.school}</span><span>${edu.dates}</span></div>
                    <div class="entry-sub"><span>${edu.degree}</span><span>${edu.grade}</span></div>
                </div>
            `).join('')}
        </section>

        <!-- Declaration & Signature -->
        <div class="declaration-section">
            <p>Declaration:</p>
            <p>${personal.declaration || ''}</p>
            <div class="signature-grid">
                <div class="sig-left">
                    <div>Place: ${personal.place || ''}</div>
                    <div>Date: ${personal.date || ''}</div>
                </div>
                <div class="sig-right">
                    <div>(${personal.preferredName || personal.fullName || ''})</div>
                    <div>(preferred name: ${personal.preferredName || ''})</div>
                </div>
            </div>
        </div>
    `;

    preview.innerHTML = html;
}

function exportToJson() {
    saveAs(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), 'resume-data.json');
}

function importFromJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        Object.assign(state, data);
        ['experience-list', 'education-list', 'certification-list', 'project-list', 'skills-list'].forEach(id => document.getElementById(id).innerHTML = '');

        const inputs = [
            'fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location',
            'summary', 'portfolio', 'roles', 'declaration', 'place', 'date',
            'preferredName', 'softSkills', 'languages', 'hobbies'
        ];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (['softSkills', 'languages', 'hobbies'].includes(id)) el.value = state[id] || '';
                else el.value = state.personal[id] || '';
            }
        });

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
        const docxLib = window.docx || (typeof docx !== 'undefined' ? docx : null);
        if (!docxLib) { alert("DOCX library not loaded yet."); return; }
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = docxLib;

        const children = [];

        // Header
        children.push(
            new Paragraph({
                text: (state.personal.fullName || 'YOUR NAME').toUpperCase(),
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun(state.personal.email || ''),
                    new TextRun(state.personal.phone ? `    ${state.personal.phone}` : ''),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun(state.personal.linkedin || ''),
                    new TextRun(state.personal.location ? `   ${state.personal.location}` : ''),
                ],
                spacing: { after: 200 }
            })
        );

        if (state.personal.roles) {
            const roles = state.personal.roles.split(',').map(r => r.trim()).filter(Boolean);
            children.push(new Paragraph({
                text: `|| ${roles.join(' || ')} ||`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 }
            }));
        }

        const addSection = (title, contentLines) => {
            children.push(new Paragraph({ text: title, heading: HeadingLevel.HEADING_3, border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } } }));
            contentLines.forEach(line => {
                if (typeof line === 'string') children.push(new Paragraph({ text: line }));
                else children.push(line);
            });
        };

        // Summary
        addSection("Professional Summary", [new Paragraph({ text: state.personal.summary })]);

        // Experience
        if (state.experience.length) {
            children.push(new Paragraph({ text: "Work Experience", heading: HeadingLevel.HEADING_3 }));
            state.experience.forEach(exp => {
                children.push(new Paragraph({
                    children: [new TextRun({ text: exp.company, bold: true }), new TextRun({ text: `\t${exp.dates}`, bold: true })]
                }));
                children.push(new Paragraph({
                    children: [new TextRun({ text: exp.role, italic: true }), new TextRun({ text: `\t${exp.location}`, italic: true })]
                }));
                exp.description.split('\n').filter(l => l.trim()).forEach(l => {
                    children.push(new Paragraph({ text: l.trim(), bullet: { level: 0 } }));
                });
            });
        }

        // Skills, Hobbies, etc.
        if (state.skills.length) {
            addSection("Technical Skills", state.skills.map(cat => new Paragraph({
                children: [new TextRun({ text: `${cat.name}: `, bold: true }), new TextRun(cat.skills.join(', '))]
            })));
        }

        // Footer
        children.push(new Paragraph({ text: "Declaration:", spacing: { before: 400 } }));
        children.push(new Paragraph({ text: state.personal.declaration }));

        children.push(new Paragraph({
            children: [
                new TextRun(`Place: ${state.personal.place}\t\t\t\t\t(${state.personal.preferredName || state.personal.fullName})`),
            ],
            spacing: { before: 200 }
        }));
        children.push(new Paragraph({
            children: [
                new TextRun(`Date: ${state.personal.date}\t\t\t\t\t(preferred name: ${state.personal.preferredName})`),
            ]
        }));

        const doc = new Document({ sections: [{ children }] });
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "resume.docx");
    } catch (err) { console.error(err); alert("Error: " + err.message); }
}

init();
