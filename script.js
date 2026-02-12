const state = {
    personal: {},
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: []
};

// Initial state with some sample data structure
function init() {
    setupEventListeners();
    addSkillCategory('Core Competencies');
    updatePreview();
}

function setupEventListeners() {
    const inputs = ['fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location', 'summary'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', (e) => {
            state.personal[id] = e.target.value;
            updatePreview();
        });
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
        item.company = '';
        item.role = '';
        item.dates = '';
        item.location = '';
        item.description = '';
        state.experience.push(item);
        renderExperienceItem(item);
    } else if (type === 'education') {
        item.school = '';
        item.degree = '';
        item.dates = '';
        item.grade = '';
        state.education.push(item);
        renderEducationItem(item);
    } else if (type === 'certification') {
        item.name = '';
        state.certifications.push(item);
        renderCertificationItem(item);
    } else if (type === 'project') {
        item.name = '';
        item.description = '';
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
            <div class="form-group">
                <label>Company</label>
                <input type="text" oninput="updateItem('experience', ${item.id}, 'company', this.value)" placeholder="e.g. Google">
            </div>
            <div class="form-group">
                <label>Role</label>
                <input type="text" oninput="updateItem('experience', ${item.id}, 'role', this.value)" placeholder="e.g. Senior Developer">
            </div>
            <div class="form-group">
                <label>Dates</label>
                <input type="text" oninput="updateItem('experience', ${item.id}, 'dates', this.value)" placeholder="e.g. 2020 - Present">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" oninput="updateItem('experience', ${item.id}, 'location', this.value)" placeholder="e.g. Mountain View, CA">
            </div>
            <div class="form-group full-width">
                <label>Description (One bullet per line)</label>
                <textarea oninput="updateItem('experience', ${item.id}, 'description', this.value)" rows="3"></textarea>
            </div>
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
            <div class="form-group">
                <label>School/University</label>
                <input type="text" oninput="updateItem('education', ${item.id}, 'school', this.value)" placeholder="e.g. MIT">
            </div>
            <div class="form-group">
                <label>Degree</label>
                <input type="text" oninput="updateItem('education', ${item.id}, 'degree', this.value)" placeholder="e.g. B.S. CS">
            </div>
            <div class="form-group">
                <label>Dates</label>
                <input type="text" oninput="updateItem('education', ${item.id}, 'dates', this.value)" placeholder="e.g. 2016 - 2020">
            </div>
            <div class="form-group">
                <label>Grade/CGPA</label>
                <input type="text" oninput="updateItem('education', ${item.id}, 'grade', this.value)" placeholder="e.g. 3.9/4.0">
            </div>
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
        <div class="form-group">
            <input type="text" oninput="updateItem('certification', ${item.id}, 'name', this.value)" placeholder="e.g. AWS Solutions Architect">
        </div>
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
        <div class="form-group">
            <label>Project Name</label>
            <input type="text" oninput="updateItem('project', ${item.id}, 'name', this.value)" placeholder="e.g. AI Chatbot">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea oninput="updateItem('project', ${item.id}, 'description', this.value)" rows="2"></textarea>
        </div>
    `;
    container.appendChild(div);
    lucide.createIcons();
}

function addSkillCategory(name = '') {
    const id = Date.now();
    const category = { id, name, skills: [] };
    state.skills.push(category);
    
    const container = document.getElementById('skills-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item skill-category';
    div.id = `skill-cat-${id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('skills', ${id})"><i data-lucide="trash-2"></i></button>
        <div class="skill-category-header">
            <div class="form-group full-width">
                <label>Category (e.g. Soft Skills, Core Skills)</label>
                <input type="text" value="${name}" oninput="updateSkillCategory(${id}, this.value)" placeholder="Category Name">
            </div>
        </div>
        <div class="form-group">
            <label>Skills (Comma separated)</label>
            <input type="text" oninput="updateSkills(${id}, this.value)" placeholder="Skill 1, Skill 2, ...">
        </div>
    `;
    container.appendChild(div);
    lucide.createIcons();
    updatePreview();
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
    const prefix = type === 'experience' ? 'exp-' : 
                   type === 'education' ? 'edu-' : 
                   type === 'certification' ? 'cert-' : 
                   type === 'project' ? 'proj-' : 'skill-cat-';
    document.getElementById(`${prefix}${id}`).remove();
    updatePreview();
}

function updatePreview() {
    const preview = document.getElementById('resume-preview');
    
    // Header
    let html = `
        <header style="text-align: center; margin-bottom: 20pt; background: none; padding: 0; border: none; backdrop-filter: none;">
            <h1 style="border-bottom: 2pt solid #000; padding-bottom: 5pt; margin-bottom: 5pt;">${state.personal.fullName || 'YOUR NAME'}</h1>
            <div style="font-size: 11pt; color: #555; margin-bottom: 2pt; font-weight: bold;">${state.personal.jobTitle || ''}</div>
            <div class="contact-info" style="justify-content: center; color: #333; font-size: 9pt;">
                ${state.personal.email ? `<span>${state.personal.email}</span>` : ''}
                ${state.personal.phone ? `<span> | ${state.personal.phone}</span>` : ''}
                ${state.personal.location ? `<span> | ${state.personal.location}</span>` : ''}
                ${state.personal.linkedin ? `<span> | ${state.personal.linkedin}</span>` : ''}
            </div>
        </header>
    `;

    // Summary
    if (state.personal.summary) {
        html += `
            <section>
                <h3>Professional Summary</h3>
                <p style="font-size: 10pt; text-align: justify;">${state.personal.summary}</p>
            </section>
        `;
    }

    // Experience
    if (state.experience.length > 0) {
        html += `<section><h3>Work Experience</h3>`;
        state.experience.forEach(exp => {
            html += `
                <div class="entry">
                    <div class="entry-header">
                        <span>${exp.company}</span>
                        <span>${exp.dates}</span>
                    </div>
                    <div class="entry-sub">
                        <span>${exp.role}</span>
                        <span>${exp.location}</span>
                    </div>
                    <ul class="bullets" style="font-size: 10pt;">
                        ${exp.description ? exp.description.split('\n').map(line => line.trim() ? `<li>${line}</li>` : '').join('') : ''}
                    </ul>
                </div>
            `;
        });
        html += `</section>`;
    }

    // Education
    if (state.education.length > 0) {
        html += `<section><h3>Education</h3>`;
        state.education.forEach(edu => {
            html += `
                <div class="entry">
                    <div class="entry-header">
                        <span>${edu.school}</span>
                        <span>${edu.dates}</span>
                    </div>
                    <div class="entry-sub">
                        <span>${edu.degree}</span>
                        <span>${edu.grade}</span>
                    </div>
                </div>
            `;
        });
        html += `</section>`;
    }

    // Skills
    if (state.skills.length > 0) {
        html += `<section><h3>Skills & Competencies</h3>`;
        state.skills.forEach(cat => {
            if (cat.name || cat.skills.length > 0) {
                html += `
                    <div class="skill-line" style="font-size: 10pt;">
                        <span class="skill-name">${cat.name}:</span>
                        <span>${cat.skills.join(', ')}</span>
                    </div>
                `;
            }
        });
        html += `</section>`;
    }

    // Certifications
    if (state.certifications.length > 0) {
        html += `<section><h3>Certifications</h3><ul class="bullets" style="font-size: 10pt;">`;
        state.certifications.forEach(cert => {
            if (cert.name) html += `<li>${cert.name}</li>`;
        });
        html += `</ul></section>`;
    }

    // Projects
    if (state.projects.length > 0) {
        html += `<section><h3>Projects & Achievements</h3>`;
        state.projects.forEach(proj => {
            html += `
                <div class="entry" style="font-size: 10pt;">
                    <div style="font-weight: bold;">${proj.name}</div>
                    <p>${proj.description}</p>
                </div>
            `;
        });
        html += `</section>`;
    }

    if (Object.keys(state.personal).length === 0 && state.experience.length === 0 && state.education.length === 0) {
        preview.innerHTML = `
            <div class="preview-placeholder">
                <i data-lucide="eye" size="48"></i>
                <p>Enter your details to generate live preview</p>
            </div>
        `;
        lucide.createIcons();
    } else {
        preview.innerHTML = html;
    }
}

function exportToJson() {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    saveAs(blob, 'resume-data.json');
}

function importFromJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        Object.assign(state, data);
        
        // Re-render editor UI
        document.getElementById('experience-list').innerHTML = '';
        document.getElementById('education-list').innerHTML = '';
        document.getElementById('certification-list').innerHTML = '';
        document.getElementById('project-list').innerHTML = '';
        document.getElementById('skills-list').innerHTML = '';
        
        // Populate inputs
        const inputs = ['fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location', 'summary'];
        inputs.forEach(id => {
            document.getElementById(id).value = state.personal[id] || '';
        });
        
        state.experience.forEach(renderExperienceItem);
        state.education.forEach(renderEducationItem);
        state.certifications.forEach(renderCertificationItem);
        state.projects.forEach(renderProjectItem);
        state.skills.forEach(cat => {
            // Re-render skill categories manually to keep the custom logic
            addSkillCategoryFromData(cat);
        });
        
        updatePreview();
    };
    reader.readAsText(file);
}

function addSkillCategoryFromData(cat) {
    const container = document.getElementById('skills-list');
    const div = document.createElement('div');
    div.className = 'dynamic-item skill-category';
    div.id = `skill-cat-${cat.id}`;
    div.innerHTML = `
        <button class="btn-remove" onclick="removeItem('skills', ${cat.id})"><i data-lucide="trash-2"></i></button>
        <div class="skill-category-header">
            <div class="form-group full-width">
                <label>Category</label>
                <input type="text" value="${cat.name}" oninput="updateSkillCategory(${cat.id}, this.value)" placeholder="Category Name">
            </div>
        </div>
        <div class="form-group">
            <label>Skills (Comma separated)</label>
            <input type="text" value="${cat.skills.join(', ')}" oninput="updateSkills(${cat.id}, this.value)" placeholder="Skill 1, Skill 2, ...">
        </div>
    `;
    container.appendChild(div);
    lucide.createIcons();
}

async function exportToDocx() {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = docx;

    const children = [];

    // Header
    children.push(
        new Paragraph({
            text: state.personal.fullName || 'YOUR NAME',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            text: state.personal.jobTitle || '',
            alignment: AlignmentType.CENTER,
            spacing: { before: 100 },
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun(state.personal.email || ''),
                new TextRun(state.personal.phone ? ` | ${state.personal.phone}` : ''),
                new TextRun(state.personal.location ? ` | ${state.personal.location}` : ''),
                new TextRun(state.personal.linkedin ? ` | ${state.personal.linkedin}` : ''),
            ],
            spacing: { after: 300 },
        })
    );

    // Summary
    if (state.personal.summary) {
        children.push(
            new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_3 }),
            new Paragraph({ text: state.personal.summary, spacing: { after: 200 } })
        );
    }

    // Experience
    if (state.experience.length > 0) {
        children.push(new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_3 }));
        state.experience.forEach(exp => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.company, bold: true }),
                        new TextRun({ text: `\t${exp.dates}`, bold: true }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.role, italic: true }),
                        new TextRun({ text: `\t${exp.location}`, italic: true }),
                    ],
                })
            );
            if (exp.description) {
                exp.description.split('\n').forEach(line => {
                    if (line.trim()) {
                        children.push(new Paragraph({ text: line.trim(), bullet: { level: 0 } }));
                    }
                });
            }
            children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
        });
    }

    // Education
    if (state.education.length > 0) {
        children.push(new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_3 }));
        state.education.forEach(edu => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.school, bold: true }),
                        new TextRun({ text: `\t${edu.dates}`, bold: true }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.degree, italic: true }),
                        new TextRun({ text: `\t${edu.grade}`, italic: true }),
                    ],
                }),
                new Paragraph({ text: "", spacing: { after: 100 } })
            );
        });
    }

    // Skills
    if (state.skills.length > 0) {
        children.push(new Paragraph({ text: "SKILLS & COMPETENCIES", heading: HeadingLevel.HEADING_3 }));
        state.skills.forEach(cat => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `${cat.name}: `, bold: true }),
                        new TextRun(cat.skills.join(', ')),
                    ],
                })
            );
        });
        children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    }

    // Certifications
    if (state.certifications.length > 0) {
        children.push(new Paragraph({ text: "CERTIFICATIONS", heading: HeadingLevel.HEADING_3 }));
        state.certifications.forEach(cert => {
            if (cert.name) children.push(new Paragraph({ text: cert.name, bullet: { level: 0 } }));
        });
        children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
    }

    // Projects
    if (state.projects.length > 0) {
        children.push(new Paragraph({ text: "PROJECTS & ACHIEVEMENTS", heading: HeadingLevel.HEADING_3 }));
        state.projects.forEach(proj => {
            children.push(
                new Paragraph({ text: proj.name, bold: true }),
                new Paragraph({ text: proj.description }),
                new Paragraph({ text: "", spacing: { after: 100 } })
            );
        });
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "resume.docx");
    });
}

init();
