
document.addEventListener('DOMContentLoaded', function () {
  const terminal = document.getElementById('terminal');
  const commandInput = document.getElementById('commandInput');
  const suggestionBox = document.getElementById('suggestion-box');
  const output = document.getElementById('output');
  const terminalPopup = document.getElementById('terminalPopup');
  const popupBody = document.getElementById('popupBody');
  const closePopupButton = document.getElementById('closePopup');
  const reviewFormContainer = document.getElementById('reviewFormContainer');
  const reviewForm = document.getElementById('reviewForm');
  const feedbackPopup = document.getElementById('feedbackPopup');
  const typingMessage = document.getElementById('typingMessage');
  const glitchText = document.getElementById('glitchText');

  // ✅ New: Get the background video
  const bgVideo = document.getElementById('bg-video');

  // ✅ New: Switch to mobile video if needed
  if (window.innerWidth <= 768 && bgVideo) {
    bgVideo.src = './assets/videos/mobile.mp4';
    bgVideo.load();
    bgVideo.play().catch(e => {
      console.log('Autoplay might be blocked:', e);
    });
  }

  const introText = "WELCOME TO MY PORTFOLIO";
  let introIndex = 0;

  function typeGlitch() {
    if (introIndex < introText.length) {
      const char = introText[introIndex] === ' ' ? '\u00A0' : introText[introIndex];
      const span = document.createElement('span');
      span.className = 'glitch-char';
      span.textContent = char;
      span.setAttribute('data-char', char);
      glitchText.appendChild(span);
      introIndex++;
      setTimeout(typeGlitch, 100);
    } else {
      setTimeout(() => {
        glitchText.style.display = 'none';
        document.querySelector('.typing-container').style.display = 'none';
        terminal.style.display = 'block';
      }, 1200);
    }
  }

  typeGlitch();

  function typeInPopup(html, elementId, speed = 10, callback) {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText;

    (function typeChar() {
      if (i < text.length) {
        el.innerHTML += text[i++] === '\n' ? '<br>' : text[i - 1];
        setTimeout(typeChar, speed);
      } else {
        el.innerHTML = html;
        if (callback) callback();
      }
    })();
  }

  function attachContactHandlers() {
    const container = document.getElementById('popupTypingArea');
    if (!container) return;

    const items = container.querySelectorAll('.contact-item');
    items.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        if (type === 'Email') {
          window.open('https://mail.google.com/mail/?view=cm&fs=1&to=eaxnexora@gmail.com', '_blank');
        } else if (type === 'linkedin') {
          window.open('https://www.linkedin.com/in/mohammad-nafis-ansari-22134b37b', '_blank');
        } else if (type === 'Eaz Nexora') {
          window.open('https://www.eaznexora.com/', '_blank');
        }
      });
    });
  }

  function showPopupTyping(text) {
    terminalPopup.style.display = 'block';
    popupBody.innerHTML = `<div id="popupTypingArea" class="popup-body-text"></div>`;
    typeInPopup(text, 'popupTypingArea', 10, attachContactHandlers);
  }

  function addToTerminal(text) {
    const newLine = document.createElement('div');
    newLine.className = 'line';
    newLine.textContent = text;
    output.appendChild(newLine);
    output.scrollTop = output.scrollHeight;
  }

  let suggestions = [];
  let selectedIndex = -1;

  const commands = {
    about: {
      text: `> Hey there! I'm <span class="highlight">Mohammad Nafis Ansari</span>, a driven and enthusiastic Computer Science undergraduate at <span class="highlight">Oriental Sanpada College of Commerce and Technology</span>. I'm not just learning tech — I'm <em>living</em> it.<br><br>
      > My journey in technology is fueled by a relentless curiosity and a genuine passion for <span class="highlight">Cybersecurity</span> and <span class="highlight">Full Stack Web Development</span>. From designing clean, user-focused interfaces to diving deep into system vulnerabilities, I thrive on turning ideas into impactful digital solutions.<br><br>
      > Crrently Im the <span class="highlight">Chief Executive Officer</span> (CEO) of <span class="highlight">Eaz Nexora</span>.<br><br>
      > 🛡️ With hands-on experience in <span class="highlight">Penetration Testing</span> and <span class="highlight">Bug Hunting</span>, I don’t just build websites — I secure them. I’ve sharpened my skills in <span class="highlight">HTML</span>, <span class="highlight">CSS</span>, <span class="highlight">JavaScript</span>, <span class="highlight">Java</span>, <span class="highlight">C</span>, and <span class="highlight">C++</span>, while exploring the exciting potential of <span class="highlight">AI technologies</span> like <span class="highlight">OpenAI</span>.<br><br>
      > 🚀 I believe in building solutions that are not only powerful and scalable, but also safe, ethical, and accessible. Whether it's developing secure web platforms or automating systems with AI, I'm here to shape the future of tech — one project at a time.<br><br>
      > 💡 I’m always open to exciting collaborations, innovative ideas, or just a good geeky conversation. Let's connect and explore the world of <span class="highlight">cybersecurity</span>, <span class="highlight">AI innovation</span>, and everything in between!<br>`
    },
    skills: {
      text: `HTML, CSS, JavaScript, C, C++, Java, Cyber Security, Data Analysis`,
    },
    projects: {
      text: `> <a href="https://www.eaznexora.com/">Home Page – Cybersecurity & Web Dev Resources</a><br>> <a href="https://www.eaznexora.com/">E‑Plant Shopping – React + Express E‑commerce</a><br>> <a href="https://www.eaznexora.com/">Express Book Reviews – Backend Book Management</a>`
    },
    education: {
      text: `🎓 FY.B.SC in Computer Science (Ongoing)<br>🏅 IBM – Cybersecurity Fundamentals <br>💻 CISCO – Networking Basics <br>🏅 IBM – Artificial Intelligence Fundamentals <br>💻 Hacker X – Ethical Hacking & Cybersecurity <br>12th in Science (2025)<br>10th Standard (2023)`
    },
    contact: {
      text: `
        <div class="contact-list">
          <div class="contact-item" data-type="Email">📧 <strong>Email</strong><br><span>Click to compose</span></div>
          <div class="contact-item" data-type="linkedin">🔗 <strong>LinkedIn</strong><br><span>Mohammad Nafis Ansari</span></div>
          <div class="contact-item" data-type="Eaz Nexora">💻 <strong>GitHub</strong><br><span>Company Website</span></div>
        </div>`
    },
    review: {
      action: () => {
        terminalPopup.style.display = 'block';
        popupBody.innerHTML = '';
        popupBody.appendChild(reviewFormContainer);
        reviewFormContainer.style.display = 'block';
        setTimeout(() => reviewForm.scrollIntoView({ behavior: 'smooth' }), 100);
        addToTerminal('> Review form opened. Fill it out and submit.');
      }
    },
    clear: {
      action: () => {
        output.innerHTML = '';
        terminalPopup.style.display = 'none';
        reviewFormContainer.style.display = 'none';
        addToTerminal('> Screen cleared. Type a command to continue.');
      }
    },
    help: {
      text: `Available commands:<br>about<br>skills<br>projects<br>education<br>contact<br>review<br>clear<br>help`
    }
  };

  commandInput.addEventListener('input', () => {
    const val = commandInput.value.trim().toLowerCase();
    suggestionBox.innerHTML = '';
    selectedIndex = -1;
    if (!val) return suggestionBox.style.display = 'none';

    suggestions = Object.keys(commands).filter(cmd => cmd.startsWith(val));
    if (!suggestions.length) return suggestionBox.style.display = 'none';

    suggestions.forEach(cmd => {
      const div = document.createElement('div');
      div.className = 'suggestion';
      div.textContent = cmd;
      div.onclick = () => {
        suggestionBox.style.display = 'none';
        commandInput.value = '';
        executeCommand(cmd);
      };
      suggestionBox.appendChild(div);
    });
    suggestionBox.style.display = 'block';
  });

  commandInput.addEventListener('keydown', e => {
    const items = suggestionBox.querySelectorAll('.suggestion');
    if (!items.length) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = e.key === 'ArrowDown'
        ? (selectedIndex + 1) % items.length
        : (selectedIndex - 1 + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('active', i === selectedIndex));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = suggestions[selectedIndex] || commandInput.value.trim().toLowerCase();
      suggestionBox.style.display = 'none';
      commandInput.value = '';
      executeCommand(cmd);
    }
  });

  function executeCommand(cmdName) {
    const cmd = commands[cmdName];
    if (!cmd || cmd.text) output.innerHTML = '';
    if (!cmd) {
      showPopupTyping(`Command not found: ${cmdName}`);
      return;
    }
    if (cmd.action) {
      cmd.action();
    } else if (cmd.text) {
      showPopupTyping(cmd.text);
    }
  }

  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = reviewForm.querySelector('#user').value;
    const exp = reviewForm.querySelector('#first-impression').value;
    const rating = reviewForm.querySelector('#design-rating').value;
    const comm = reviewForm.querySelector('#feedback').value;
    const features = reviewForm.querySelector('#features').value;
    const recommend = reviewForm.querySelector('#would-recommend').value;

    if (!name || !exp || !comm || !rating || !recommend) {
      addToTerminal('> Please fill out all required fields before submitting.');
      return;
    }

    feedbackPopup.classList.add('show');
    typingMessage.textContent = '';
    const msg = 'Sending Feedback...';
    let i = 0;
    const interval = setInterval(() => {
      typingMessage.textContent += msg[i++];
      if (i === msg.length) {
        clearInterval(interval);
      }
    }, 100);

    (async () => {
      try {
        const endpoint = window.location.origin.includes('127.0.0.1')
          ? 'http://localhost:3000/send-feedback'
          : `${window.location.origin}/send-feedback`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, experience: exp, rating, comment: comm, features, recommend })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');

        typingMessage.textContent = 'Thanks for your review!';
        typingMessage.style.animation = 'none';
        addToTerminal(`> Thank you, ${name}! Your ${exp.toLowerCase()} feedback has been sent.`);
        reviewFormContainer.style.display = 'none';
        reviewForm.reset();
        setTimeout(() => feedbackPopup.classList.remove('show'), 2500);
      } catch (err) {
        console.error('Feedback submission error:', err.message);
        typingMessage.textContent = 'Sorry! Server issue. We’ll fix it soon.';
        typingMessage.style.animation = 'none';
        addToTerminal('> Failed to send feedback. Please try again later.');
        setTimeout(() => feedbackPopup.classList.remove('show'), 2500);
      }
    })();
  });

  closePopupButton?.addEventListener('click', () => {
    terminalPopup.style.display = 'none';
  });
});
