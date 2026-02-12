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
        roles: ''
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
    updatePreview();
    syncFormWithState();
}

function syncFormWithState() {
    const inputs = [
        'fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location',
        'summary', 'portfolio', 'roles', 'softSkills', 'languages', 'hobbies'
    ];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (['softSkills', 'languages', 'hobbies'].includes(id)) {
                el.value = state[id] || '';
            } else {
                el.value = state.personal[id] || '';
            }
        }
    });

    // Clear and re-render dynamic sections
    document.getElementById('experience-list').innerHTML = '';
    document.getElementById('education-list').innerHTML = '';
    document.getElementById('certification-list').innerHTML = '';
    document.getElementById('project-list').innerHTML = '';
    document.getElementById('skills-list').innerHTML = '';

    state.experience.forEach(renderExperienceItem);
    state.education.forEach(renderEducationItem);
    state.certifications.forEach(renderCertificationItem);
    state.projects.forEach(renderProjectItem);
    state.skills.forEach(addSkillCategoryFromData);
}

function setupEventListeners() {
    const inputs = [
        'fullName', 'jobTitle', 'email', 'phone', 'linkedin', 'location',
        'summary', 'portfolio', 'roles', 'softSkills', 'languages', 'hobbies'
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
        preview.innerHTML = '<div class="preview-placeholder"><i data-lucide="eye" size="48"></i><p>Enter details for live preview</p></div>';
        lucide.createIcons();
        return;
    }

    // Name Splitting (Bold/Thin)
    const nameParts = (personal.fullName || 'YOUR NAME').trim().split(' ');
    let firstName = personal.fullName ? nameParts.slice(0, -1).join(' ') : 'YOUR';
    let lastName = personal.fullName ? nameParts.slice(-1)[0] : 'NAME';
    if (!firstName && personal.fullName) { firstName = personal.fullName; lastName = ''; }

    // Contact Items with Icons
    const contactItems = [];
    if (personal.email) {
        contactItems.push(`<div class="contact-item"><i data-lucide="mail"></i> <a href="mailto:${personal.email}">${personal.email}</a></div>`);
    }
    if (personal.phone) {
        const cleanPhone = personal.phone.replace(/[^0-9+]/g, '');
        contactItems.push(`<div class="contact-item"><i data-lucide="phone"></i> <a href="tel:${cleanPhone}">${personal.phone}</a></div>`);
    }
    if (personal.linkedin) {
        const link = personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`;
        contactItems.push(`<div class="contact-item"><i data-lucide="linkedin"></i> <a href="${link}" target="_blank">${personal.linkedin.replace(/https?:\/\/(www\.)?/, '')}</a></div>`);
    }
    if (personal.location) {
        contactItems.push(`<div class="contact-item"><i data-lucide="map-pin"></i> ${personal.location}</div>`);
    }
    if (personal.portfolio) {
        const link = personal.portfolio.startsWith('http') ? personal.portfolio : `https://${personal.portfolio}`;
        contactItems.push(`<div class="contact-item"><i data-lucide="globe"></i> <a href="${link}" target="_blank">${personal.portfolio.replace(/https?:\/\/(www\.)?/, '')}</a></div>`);
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
            <div class="name-container">
                <span class="first-name">${firstName.toUpperCase()}</span>
                <span class="last-name">${lastName.toUpperCase()}</span>
            </div>
            <div class="contact-bar">
                ${contactItems.join('')}
            </div>
            ${rolesHtml}
        </div>

        <section>
            <h3>Professional Summary</h3>
            <p>${personal.summary || ''}</p>
        </section>

        ${experience.length ? `
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
        </section>` : ''}

        ${projects.length ? `
        <section>
            <h3>Projects & Achievements</h3>
            <ul class="bullets">
                ${projects.map(p => `<li><span style="font-weight:bold">${p.name}:</span> ${p.description}</li>`).join('')}
            </ul>
        </section>` : ''}

        ${skills.length ? `
        <section>
            <h3>Technical Skills</h3>
            ${skills.map(cat => cat.skills.length ? `
                <div class="skill-line">
                    <span class="skill-name">${cat.name}:</span> ${cat.skills.join(', ')}
                </div>
            ` : '').join('')}
        </section>` : ''}

        ${softSkills ? `<section><h3>Soft Skills</h3><p>${softSkills}</p></section>` : ''}
        ${languages ? `<section><h3>Languages</h3><p>${languages}</p></section>` : ''}

        ${certifications.length ? `
        <section>
            <h3>Certifications</h3>
            <ul class="bullets">
                ${certifications.map(cert => `<li>${cert.name}</li>`).join('')}
            </ul>
        </section>` : ''}

        ${hobbies ? `<section><h3>Interests & Hobbies</h3><ul class="bullets">${hobbies.split(',').map(h => `<li>${h.trim()}</li>`).join('')}</ul></section>` : ''}

        ${education.length ? `
        <section>
            <h3>Education</h3>
            ${education.map(edu => `
                <div class="entry">
                    <div class="entry-header"><span>${edu.school}</span><span>${edu.dates}</span></div>
                    <div class="entry-sub"><span>${edu.degree}</span><span>${edu.grade}</span></div>
                </div>
            `).join('')}
        </section>` : ''}
    `;

    preview.innerHTML = html;
    lucide.createIcons();
}

function exportToJson() {
    try {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });

        if (window.saveAs) {
            window.saveAs(blob, 'resume-data.json');
        } else {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resume-data.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (err) {
        console.error('Export failed:', err);
        alert('Failed to export JSON: ' + err.message);
    }
}

function importFromJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            Object.assign(state, data);
            syncFormWithState();
            updatePreview();
        } catch (err) {
            alert('Error parsing JSON file: ' + err.message);
        }
    };
    reader.readAsText(file);
}

init();
