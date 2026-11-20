/**
 * Comprehensive 10-Career Roadmap Curriculum & Learning Content
 * SkillProof AI Learning Platform
 */

const roadmapsData = [
  // 1. FULL STACK WEB DEVELOPER
  {
    slug: 'full-stack-web-developer',
    title: 'Full Stack Web Developer',
    description: 'Master modern full-stack web development from semantic HTML/CSS to reactive frontend frameworks, scalable RESTful backend microservices, database modeling, and production cloud deployment.',
    category: 'Web Development',
    icon: 'Layers',
    estimatedDuration: '6 - 9 Months',
    status: 'published',
    requiredSkills: ['HTML5', 'CSS3', 'Modern JavaScript (ES6+)', 'React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git', 'Cloud Deployment'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: Core Web Foundations',
        description: 'Establish foundational mastery of client-side web technologies, semantic markup, responsive layout systems, and modern asynchronous JavaScript.',
        modules: [
          {
            moduleId: 'fsw-m1-frontend-basics',
            title: 'HTML5, Modern CSS & Responsive Layouts',
            description: 'Semantic markup, accessibility (WCAG), CSS Flexbox, Grid, and mobile-first responsive architecture.',
            estimatedHours: 25,
            topics: [
              {
                topicId: 'fsw-t1-html-semantics',
                title: 'Semantic HTML5 & Web Accessibility (a11y)',
                summary: 'Learn semantic elements like <main>, <article>, <section>, ARIA roles, and screen-reader accessibility.',
                estimatedMinutes: 45,
                studyMaterial: {
                  introduction: 'Semantic HTML introduces meaning to the web page rather than just presentation. Browsers, search engines (SEO), and assistive technologies (screen readers) rely on semantic structure to understand document outlines.',
                  keyConcepts: ['Semantic Elements (<header>, <nav>, <main>, <article>, <aside>, <footer>)', 'Accessible Rich Internet Applications (ARIA)', 'Document Outline and Heading Hierarchy (H1-H6)', 'Alt attributes and Form Accessibility (<label for>)'],
                  detailedNotes: `Semantic HTML5 elements clearly describe their meaning to both the browser and the developer.

Why Semantic HTML Matters:
1. Accessibility (a11y): Screen readers use semantic tags to provide quick navigation landmarks for visually impaired users.
2. SEO Optimization: Search engine crawlers parse content hierarchy more effectively when enclosed in appropriate semantic tags rather than generic <div> containers.
3. Code Maintainability: Teams can read and refactor semantic markup significantly faster.

Key Landmark Elements:
- <header>: Introductory content or navigational aids.
- <nav>: A major block of navigation links.
- <main>: Dominant content of the <body> of a document. Must be unique per page.
- <article>: Self-contained composition in a document, page, application, or site (e.g., blog post, forum post).
- <section>: Standalone section of functionality or content with a heading.
- <aside>: Content indirectly related to the main content (e.g., sidebars, callouts).
- <footer>: Information about its section, such as author, copyright, or contact links.`,
                  codeSnippet: {
                    language: 'html',
                    code: `<!-- Semantic Web Page Layout Structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessible Web App</title>
</head>
<body>
  <header role="banner">
    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="#dashboard">Dashboard</a></li>
        <li><a href="#assessments">Assessments</a></li>
      </ul>
    </nav>
  </header>

  <main id="main-content" role="main">
    <article aria-labelledby="post-title">
      <h1 id="post-title">Understanding Modern Distributed Systems</h1>
      <p>Microservice architectures decouple monolithic bottlenecks...</p>
    </article>
  </main>

  <footer role="contentinfo">
    <p>&copy; 2026 SkillProof AI. All rights reserved.</p>
  </footer>
</body>
</html>`,
                    explanation: 'Notice how each structural container uses semantic elements with accessibility landmarks (role="main", aria-label) rather than non-semantic <div> elements.',
                  },
                  practicalExamples: [
                    'Form labeling: Always associate input elements with <label for="inputId"> to ensure clicking the label focuses the input.',
                    'Button vs Link: Use <button> for state mutations / actions; use <a> for URL navigation.',
                  ],
                  stepByStep: [
                    'Step 1: Audit an existing HTML page for generic <div> nesting.',
                    'Step 2: Replace outer wrappers with <header>, <nav>, <main>, and <footer>.',
                    'Step 3: Ensure each <main> element contains exactly one primary <h1>.',
                    'Step 4: Run a Lighthouse Accessibility audit in Chrome DevTools to target a 100/100 score.',
                  ],
                  practiceExercises: [
                    {
                      id: 'ex-html-a11y',
                      question: 'Refactor a form containing raw inputs without labels into an accessible form with appropriate ARIA attributes.',
                      initialCode: `<form>\n  <span>Email</span>\n  <input type="text" name="email">\n  <div onclick="submit()">Submit</div>\n</form>`,
                      solution: `<form action="/submit" method="POST">\n  <label for="user-email">Email Address</label>\n  <input id="user-email" type="email" name="email" required aria-required="true" autocomplete="email">\n  <button type="submit">Submit</button>\n</form>`,
                      hints: ['Use <label for="..."> matching input id', 'Use type="email" for validation', 'Use <button type="submit"> instead of div with click handler'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the technical difference between <div> and <section>?',
                      answer: 'A <div> is a non-semantic generic container used solely for CSS styling or DOM manipulation without conveying meaning. A <section> is a semantic element representing a thematic grouping of content, typically with a heading, that forms part of the document outline.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Semantic HTML forms the non-negotiable base of modern web development, directly driving accessibility compliance, SEO, and maintainable DOM structures.',
                },
                freeCourses: [
                  {
                    title: 'HTML & Semantic Web Development Guide',
                    provider: 'MDN Web Docs',
                    url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
                    skillCovered: 'Semantic HTML5 & Accessibility',
                    level: 'Beginner',
                    duration: '15 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                  {
                    title: 'Responsive Web Design Certification',
                    provider: 'freeCodeCamp',
                    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
                    skillCovered: 'HTML5, CSS3, Flexbox & Grid',
                    level: 'Beginner',
                    duration: '300 Hours',
                    isFree: true,
                    hasCertificate: true,
                    status: 'active',
                  },
                ],
                miniProject: {
                  title: 'Accessible Institutional Profile Card',
                  description: 'Build a mobile-first candidate card using semantic HTML5, CSS Grid, and WCAG AA color contrast standards.',
                  deliverables: ['Semantic HTML5 markup', 'CSS Grid & Flexbox styling', '100% Lighthouse Accessibility score'],
                },
              },
              {
                topicId: 'fsw-t2-css-flexbox-grid',
                title: 'CSS3 Flexbox, CSS Grid & Responsive Layouts',
                summary: 'Master one-dimensional layouts with Flexbox and two-dimensional matrix systems with CSS Grid and Media Queries.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'CSS Flexbox and CSS Grid are modern layout models that eliminate legacy float and table hacks. Flexbox optimizes 1-dimensional item alignment; Grid handles complex 2-dimensional row-and-column matrices.',
                  keyConcepts: ['Flexbox container vs items', 'justify-content, align-items, flex-wrap', 'Grid template columns (fr units, repeat, minmax)', 'CSS Media Queries (@media (max-width: 768px))', 'Mobile-First design philosophy'],
                  detailedNotes: `Flexbox vs Grid: When to Use Which?
- Use Flexbox when:
  * You need alignment along a single axis (either row or column).
  * The size of items should determine the space distribution.
  * Creating component-level layouts (navbars, card headers, button groups).
- Use CSS Grid when:
  * You need to control both horizontal rows and vertical columns simultaneously.
  * You want layout structure decoupled from DOM content order.
  * Building page-level layout skeletons (dashboards, galleries, editorial feeds).`,
                  codeSnippet: {
                    language: 'css',
                    code: `/* Responsive Responsive Grid Matrix */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

/* Flexbox Action Strip */
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}`,
                    explanation: 'auto-fit with minmax(280px, 1fr) automatically reorganizes cards across viewport widths without requiring brittle media queries.',
                  },
                  practicalExamples: [
                    'Centering any element: display: flex; justify-content: center; align-items: center;',
                    'Sticky footer layout: display: flex; flex-direction: column; min-height: 100vh; and flex: 1 on main.',
                  ],
                  stepByStep: [
                    'Step 1: Set display: flex on the container.',
                    'Step 2: Define primary axis alignment with justify-content.',
                    'Step 3: Define cross axis alignment with align-items.',
                    'Step 4: Use CSS Grid for the outer dashboard layout and Flexbox for widget internals.',
                  ],
                  practiceExercises: [
                    {
                      id: 'ex-grid-responsive',
                      question: 'Write a CSS Grid declaration for a 3-column desktop layout that gracefully collapses to 1 column on screens under 768px.',
                      initialCode: `.container {\n  /* write grid rules here */\n}`,
                      solution: `.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1.5rem;\n}`,
                      hints: ['Use repeat with auto-fit', 'Use minmax to enforce a minimum card size'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between justify-content and align-items in Flexbox?',
                      answer: 'justify-content aligns flex items along the main axis (horizontal by default when flex-direction is row), whereas align-items aligns items along the cross axis (vertical by default).',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Modern web layouts rely on CSS Grid for outer page scaffolding and Flexbox for component-level alignment.',
                },
                freeCourses: [
                  {
                    title: 'Learn CSS Flexbox and Grid Interactive Guide',
                    provider: 'MDN Web Docs',
                    url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout',
                    skillCovered: 'Flexbox, Grid, Multi-column Layouts',
                    level: 'Beginner',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
          {
            moduleId: 'fsw-m2-js-core',
            title: 'Modern JavaScript (ES6+), DOM & Async Programming',
            description: 'Core language features, arrow functions, destructuring, promises, async/await, closures, and the browser event loop.',
            estimatedHours: 35,
            topics: [
              {
                topicId: 'fsw-t3-js-async',
                title: 'Asynchronous JavaScript: Promises, Async/Await & Event Loop',
                summary: 'Master JavaScript single-threaded concurrency, Call Stack, Web APIs, Microtask Queue, and Promises.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'JavaScript is a single-threaded runtime environment. Non-blocking I/O operations (fetching network data, file streams, timers) rely on the Event Loop and Microtask Queue.',
                  keyConcepts: ['Call Stack & Web APIs', 'Task Queue (Macrotasks) vs Microtask Queue (Promises)', 'Promise lifecycle: pending, fulfilled, rejected', 'try / catch with async/await syntax', 'Promise.all vs Promise.allSettled'],
                  detailedNotes: `Understanding the Event Loop:
1. The Call Stack executes synchronous code one frame at a time.
2. When an asynchronous operation (like fetch() or setTimeout()) is encountered, it is delegated to the browser Web APIs environment.
3. Upon completion, Promise callbacks (.then, async resume) are placed into the Microtask Queue.
4. Timers and DOM event callbacks are placed into the Macrotask (Callback) Queue.
5. The Event Loop prioritizes draining the entire Microtask Queue before processing the next Macrotask.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// Modern Async/Await with Robust Error Handling
async function fetchCandidateTelemetry(candidateId) {
  try {
    const response = await fetch(\`/api/v1/students/\${candidateId}/passport\`, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data.passport;
  } catch (error) {
    console.error('[Telemetry Sync Failure]:', error.message);
    throw error;
  }
}`,
                    explanation: 'async/await allows asynchronous code to be written and read sequentially while retaining full non-blocking asynchronous behavior.',
                  },
                  practicalExamples: [
                    'Parallel execution: Use Promise.all([fetchA(), fetchB()]) when both network calls are independent.',
                    'Resilient parallel execution: Use Promise.allSettled() when you want all requests to finish even if one fails.',
                  ],
                  stepByStep: [
                    'Step 1: Identify slow or blocking I/O operations.',
                    'Step 2: Wrap network requests in asynchronous functions returning Promises.',
                    'Step 3: Await results sequentially or use Promise.all for concurrency.',
                    'Step 4: Always implement explicit try/catch blocks to handle potential network dropouts.',
                  ],
                  practiceExercises: [
                    {
                      id: 'ex-async-retry',
                      question: 'Write a helper function fetchWithRetry(url, retries = 3) that retries a failed fetch up to 3 times before throwing an error.',
                      initialCode: `async function fetchWithRetry(url, retries = 3) {\n  // implement retry logic\n}`,
                      solution: `async function fetchWithRetry(url, retries = 3) {\n  for (let attempt = 1; attempt <= retries; attempt++) {\n    try {\n      const res = await fetch(url);\n      if (!res.ok) throw new Error(\`Status \${res.status}\`);\n      return await res.json();\n    } catch (err) {\n      if (attempt === retries) throw err;\n    }\n  }\n}`,
                      hints: ['Use a for loop up to retries', 'Catch the error and retry if attempt < retries'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between the Microtask Queue and the Macrotask Queue?',
                      answer: 'Microtasks (Promises, queueMicrotask, MutationObserver) have higher priority than Macrotasks (setTimeout, setInterval, setImmediate). The event loop drains the entire microtask queue after every single macrotask before picking up the next macrotask.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Mastering the Event Loop and async/await is essential for writing performant, race-condition-free web applications.',
                },
                freeCourses: [
                  {
                    title: 'JavaScript.info: The Modern JavaScript Tutorial',
                    provider: 'JavaScript.info',
                    url: 'https://javascript.info/',
                    skillCovered: 'ES6+, Promises, Event Loop, Async/Await',
                    level: 'Beginner',
                    duration: '50 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Frontend React & Backend Node.js',
        description: 'Build enterprise SPAs with React, Hooks, state management, and construct secure RESTful APIs with Node.js, Express, and MongoDB.',
        modules: [
          {
            moduleId: 'fsw-m3-react-core',
            title: 'React Architecture, Hooks & Component Lifecycle',
            description: 'JSX, useState, useEffect, useRef, custom hooks, context API, and optimized rendering.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'fsw-t4-react-hooks',
                title: 'State Management & Side Effects with React Hooks',
                summary: 'Master useState, useEffect dependency arrays, cleanup functions, and avoiding unnecessary re-renders.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'React Hooks allow functional components to maintain internal state and hook into lifecycle milestones without class components.',
                  keyConcepts: ['useState state updates and functional setters', 'useEffect execution timing and dependency arrays', 'Cleanup functions (aborting fetch, removing listeners)', 'useCallback and useMemo optimization', 'Rules of Hooks'],
                  detailedNotes: `React Component Lifecycle with Hooks:
- Mount: Component renders for the first time. useEffect with [] runs once after DOM painting.
- Update: Triggered by changes to props or state. useEffect runs if any dependency in its array changes value.
- Unmount: Component is removed from DOM. Cleanup functions returned from useEffect are executed.

Common Mistakes:
- Missing dependencies in useEffect dependency array leading to stale closures.
- Overusing useEffect for state derivation instead of computing values during render.`,
                  codeSnippet: {
                    language: 'jsx',
                    code: `import React, { useState, useEffect } from 'react';

export const CandidateTelemetry = ({ candidateId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTelemetry() {
      try {
        setLoading(true);
        const res = await fetch(\`/api/v1/students/\${candidateId}/passport\`, {
          signal: controller.signal
        });
        const json = await res.json();
        setData(json.passport);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTelemetry();

    // Cleanup function cancels in-flight fetch if candidateId changes or unmounts
    return () => controller.abort();
  }, [candidateId]);

  if (loading) return <div>Synchronizing telemetry...</div>;
  return <div>Readiness Score: {data?.jobReadinessIndex}%</div>;
};`,
                    explanation: 'The AbortController pattern prevents race conditions and memory leaks when props rapidly change.',
                  },
                  practicalExamples: [
                    'Functional state updates: setCount(prev => prev + 1) guarantees using the latest state regardless of batching.',
                  ],
                  stepByStep: [
                    'Step 1: Declare component local state with useState.',
                    'Step 2: Declare side effects with useEffect.',
                    'Step 3: Specify exact dependencies in the dependency array.',
                    'Step 4: Return a cleanup function if setting up event listeners, timers, or network streams.',
                  ],
                  practiceExercises: [
                    {
                      id: 'ex-use-debounce',
                      question: 'Create a custom hook useDebounce(value, delay) that delays updating its return value until the user pauses typing.',
                      initialCode: `function useDebounce(value, delay) {\n  // implement hook\n}`,
                      solution: `import { useState, useEffect } from 'react';\n\nfunction useDebounce(value, delay) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}`,
                      hints: ['Use setTimeout inside useEffect', 'Return clearTimeout in the cleanup function'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'Why must hooks only be called at the top level of a React component?',
                      answer: 'React relies on the call order of hooks on every render to correctly associate internal state cells with each hook invocation. Calling hooks inside conditions or loops would disrupt this fixed index sequence.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Hooks provide declarative state and lifecycle control in functional components. Understanding dependency arrays prevents stale closures and re-render loops.',
                },
                freeCourses: [
                  {
                    title: 'Official React Documentation: Quick Start & Learn React',
                    provider: 'React Official Docs',
                    url: 'https://react.dev/learn',
                    skillCovered: 'Components, State, Hooks, Effects',
                    level: 'Intermediate',
                    duration: '25 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
          {
            moduleId: 'fsw-m4-backend-express',
            title: 'Node.js, Express.js & RESTful API Architecture',
            description: 'Event-driven server runtime, middleware chains, REST standards, error handling, and JWT authentication.',
            estimatedHours: 45,
            topics: [
              {
                topicId: 'fsw-t5-express-rest',
                title: 'RESTful API Engineering, Middleware & JWT Security',
                summary: 'Design scalable Express routes, request validation, centralized error handling, and role-based access control.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Express.js is a lightweight web application framework for Node.js. It organizes server request processing into composable middleware functions.',
                  keyConcepts: ['Middleware execution pipeline (req, res, next)', 'HTTP Methods (GET, POST, PUT, DELETE, PATCH) and Status Codes', 'JWT authentication (Stateless tokens, expiration)', 'Role-based access control (RBAC)', 'Centralized error handling middleware'],
                  detailedNotes: `REST API Best Practices:
1. Nouns over Verbs: Use /api/v1/assessments instead of /api/v1/getAssessments.
2. Proper HTTP Status Codes:
   - 200 OK: Successful query
   - 201 Created: Successful entity creation
   - 400 Bad Request: Client validation error
   - 401 Unauthorized: Missing or invalid token
   - 403 Forbidden: Valid token but insufficient role permissions
   - 404 Not Found: Resource does not exist
   - 500 Internal Server Error: Unhandled server exception
3. Consistent Response Envelopes:
   Always return { success: Boolean, data: Object, message: String }.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `const express = require('express');
const jwt = require('jsonwebtoken');

// Authorization Middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: Insufficient administrative privileges.'
      });
    }
    next();
  };
};

module.exports = { authorize };`,
                    explanation: 'The authorize middleware inspects req.user (populated by the auth verification middleware) and enforces role restrictions at the route level.',
                  },
                  practicalExamples: [
                    'Central error middleware: Always define (err, req, res, next) with 4 parameters as the last middleware.',
                  ],
                  stepByStep: [
                    'Step 1: Mount routing modules to specific endpoint prefixes.',
                    'Step 2: Chain authentication middleware to verify JWT signatures.',
                    'Step 3: Chain authorization middleware to enforce role checks.',
                    'Step 4: Catch errors inside async route handlers and delegate to next(err).',
                  ],
                  practiceExercises: [
                    {
                      id: 'ex-express-auth',
                      question: 'Write an Express middleware verifyToken that extracts the Bearer token from the Authorization header, verifies it with jwt.verify, and attaches user payload to req.user.',
                      initialCode: `function verifyToken(req, res, next) {\n  // implement middleware\n}`,
                      solution: `function verifyToken(req, res, next) {\n  const authHeader = req.headers.authorization;\n  if (!authHeader || !authHeader.startsWith('Bearer ')) {\n    return res.status(401).json({ success: false, message: 'Missing token' });\n  }\n  const token = authHeader.split(' ')[1];\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (err) {\n    return res.status(401).json({ success: false, message: 'Invalid token' });\n  }\n}`,
                      hints: ['Check req.headers.authorization', 'Extract token with split(" ")[1]', 'Attach decoded payload to req.user'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the purpose of the next() function in Express middleware?',
                      answer: 'next() passes control to the next middleware function in the stack. If next() is not invoked and no response is sent, the client request will hang indefinitely.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Middleware pipelines are the core mechanism for structuring authentication, logging, validation, and business logic in Express servers.',
                },
                freeCourses: [
                  {
                    title: 'Node.js Official Documentation & Guides',
                    provider: 'Node.js Official Docs',
                    url: 'https://nodejs.org/en/learn',
                    skillCovered: 'Node.js Architecture, Streams, Event Loop',
                    level: 'Intermediate',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: System Architecture, Databases & Cloud CI/CD',
        description: 'Design scalable databases, optimize indexing, implement microservices, containerize with Docker, and configure automated CI/CD pipelines.',
        modules: [
          {
            moduleId: 'fsw-m5-database-cloud',
            title: 'MongoDB Schema Design, Docker & Production CI/CD',
            description: 'NoSQL modeling, indexing, transactions, Docker containerization, and GitHub Actions CI/CD.',
            estimatedHours: 50,
            topics: [
              {
                topicId: 'fsw-t6-mongodb-indexing',
                title: 'High-Performance Database Modeling & Compound Indexing',
                summary: 'Optimize query execution plans with compound indexes, avoid full collection scans (COLLSCAN), and design resilient schemas.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Database queries without proper indexes require collection scans (COLLSCAN), inspecting every document in the database. Compound indexes allow queries to retrieve matching records in logarithmic time (IXSCAN).',
                  keyConcepts: ['B-Tree Index structures', 'Equality, Sort, Range (ESR) indexing rule', 'Explain plans (.explain("executionStats"))', 'Embedding vs Referencing in document databases', 'ACID Multi-document Transactions'],
                  detailedNotes: `The ESR Rule for Compound Indexes:
1. Equality: Place fields tested for exact equality first in the index.
2. Sort: Place fields that determine sort order second.
3. Range: Place fields evaluated with inequality filters ($gt, $lt, $in) last.

Example:
For query db.assessments.find({ domain: "fullStack", score: { $gte: 75 } }).sort({ createdAt: -1 })
The optimal compound index is: { domain: 1, createdAt: -1, score: 1 }`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// MongoDB Mongoose Schema with Compound Indexing
const assessmentAttemptSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  status: { type: String, enum: ['in_progress', 'completed', 'terminated'], default: 'in_progress' },
  scorePercentage: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Index to optimize: find({ student: id, status: 'completed' }).sort({ createdAt: -1 })
assessmentAttemptSchema.index({ student: 1, status: 1, createdAt: -1 });`,
                    explanation: 'The compound index follows the ESR rule, eliminating in-memory sorting overhead.',
                  },
                  practicalExamples: [
                    'Index inspection: db.collection.find(query).explain("executionStats") ensures totalDocsExamined matches nReturned.',
                  ],
                  stepByStep: [
                    'Step 1: Profile slow queries using MongoDB database profiler.',
                    'Step 2: Inspect execution plans to identify COLLSCAN stages.',
                    'Step 3: Formulate compound indexes following the ESR rule.',
                    'Step 4: Verify execution changes from COLLSCAN to IXSCAN.',
                  ],
                  practiceExercises: [
                    {
                      id: 'ex-mongo-index',
                      question: 'Write a Mongoose schema index definition to optimize queries searching for students by collegeName, sorted by cgpa descending, filtered by graduation year.',
                      initialCode: `// Define index\nschema.index(...)`,
                      solution: `schema.index({ collegeName: 1, cgpa: -1, yearOfPassing: 1 });`,
                      hints: ['Equality: collegeName', 'Sort: cgpa (-1 for descending)', 'Range: yearOfPassing'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is a covering query in MongoDB?',
                      answer: 'A covering query is a query that can be satisfied entirely from index keys without inspecting any actual documents in the collection (totalDocsExamined is 0). All query and projected fields must be contained in the index.',
                      difficulty: 'Advanced',
                    },
                  ],
                  summaryNotes: 'Proper indexing is the single highest-impact optimization for backend database scalability.',
                },
                freeCourses: [
                  {
                    title: 'MongoDB University: MongoDB Node.js Developer Path',
                    provider: 'MongoDB University',
                    url: 'https://learn.mongodb.com/',
                    skillCovered: 'Data Modeling, Aggregations, Performance Tuning',
                    level: 'Advanced',
                    duration: '18 Hours',
                    isFree: true,
                    hasCertificate: true,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'Enterprise Multi-Tenant SaaS Platform with Proctored Assessment Telemetry',
      description: 'Build a production full-stack application featuring role-based dashboards, JWT authentication, MongoDB transactions, automated GitHub Actions CI/CD, and live proctoring telemetry.',
      requirements: ['Semantic responsive UI in React', 'Secured Express REST API with RBAC', 'Optimized MongoDB models with compound indexes', 'Dockerized multi-stage container deployment'],
    },
    skillAssessment: {
      title: 'Full Stack Web Engineering Standardized Examination',
      description: 'Standardized 30-question assessment covering React internals, Node.js concurrency, REST security, and database indexing.',
      recommendedAssessmentId: 'fullstack-web-01',
    },
  },

  // 2. FRONTEND DEVELOPER
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    description: 'Master high-performance user interface engineering, reactive state architectures, modern TypeScript, CSS design systems, Web Performance Optimization (Core Web Vitals), and accessibility.',
    category: 'Web Development',
    icon: 'Layout',
    estimatedDuration: '5 - 7 Months',
    status: 'published',
    requiredSkills: ['HTML5 & a11y', 'Modern CSS & Tailwind', 'TypeScript', 'React.js', 'Next.js', 'State Management (Redux/Zustand)', 'Core Web Vitals', 'Testing (Jest/Playwright)'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: UI Foundations & Modern JavaScript',
        description: 'Semantic markup, accessible forms, modern CSS layouts, and fundamental JavaScript DOM manipulation.',
        modules: [
          {
            moduleId: 'fed-m1-dom-css',
            title: 'Modern CSS Frameworks & Browser DOM Architecture',
            description: 'Component-first styling, CSS variables, utility-first patterns, and DOM events.',
            estimatedHours: 30,
            topics: [
              {
                topicId: 'fed-t1-dom-events',
                title: 'Browser DOM Tree, Event Delegation & Bubbling',
                summary: 'Understand event propagation, capturing vs bubbling phases, event delegation, and performance implications.',
                estimatedMinutes: 50,
                studyMaterial: {
                  introduction: 'The Document Object Model (DOM) represents HTML as a tree of nodes. Efficient web applications interact with this tree using event delegation to minimize memory consumption.',
                  keyConcepts: ['Event Bubbling & Capturing', 'event.target vs event.currentTarget', 'Event Delegation on dynamic lists', 'Custom Events API'],
                  detailedNotes: `Event Propagation Phases:
1. Capturing Phase: The event travels down from window -> document -> body -> target element.
2. Target Phase: The event reaches the actual target element that triggered the action.
3. Bubbling Phase: The event bubbles back up from the target -> parent -> document -> window.

Event Delegation:
Instead of attaching separate event listeners to 1,000 table rows, attach a single listener to the parent <table> or <tbody> and inspect event.target.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// High-Performance Event Delegation
const candidateTable = document.querySelector('#candidate-directory');

candidateTable.addEventListener('click', (event) => {
  const actionButton = event.target.closest('button[data-action]');
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  const candidateId = actionButton.dataset.id;

  if (action === 'verify-passport') {
    handlePassportVerification(candidateId);
  }
});`,
                    explanation: 'event.target.closest guarantees that clicking nested icons or spans inside the button still resolves to the correct button element.',
                  },
                  practicalExamples: ['Dynamic lists: Using event delegation prevents re-binding event listeners whenever new items are fetched.'],
                  stepByStep: ['Step 1: Identify list or table containers with recurring clickable child elements.', 'Step 2: Attach a single event listener to the parent.', 'Step 3: Use event.target.closest() to identify the triggering element.'],
                  practiceExercises: [
                    {
                      id: 'ex-delegation',
                      question: 'Write an event listener using event delegation to handle clicks on tab buttons inside a navigation bar.',
                      initialCode: `const nav = document.querySelector('.nav-tabs');\nnav.addEventListener('click', (e) => {\n  // your code\n});`,
                      solution: `const nav = document.querySelector('.nav-tabs');\nnav.addEventListener('click', (e) => {\n  const tab = e.target.closest('.tab-btn');\n  if (tab) activateTab(tab.dataset.tabId);\n});`,
                      hints: ['Use e.target.closest(".tab-btn")', 'Check if tab is not null'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the practical difference between event.stopPropagation() and event.preventDefault()?',
                      answer: 'stopPropagation() halts the traversal of the event up or down the DOM tree, preventing ancestor listeners from receiving it. preventDefault() suppresses the browser default native behavior (such as form submission or following a link) without stopping propagation.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Event delegation reduces event listener overhead from O(N) to O(1) for large lists.',
                },
                freeCourses: [
                  {
                    title: 'JavaScript Event System & DOM Deep Dive',
                    provider: 'MDN Web Docs',
                    url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events',
                    skillCovered: 'DOM Events, Delegation, Propagation',
                    level: 'Beginner',
                    duration: '12 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: React, TypeScript & State Management',
        description: 'Typed enterprise components, custom hooks, global state with Zustand, and client-side routing.',
        modules: [
          {
            moduleId: 'fed-m2-react-ts',
            title: 'TypeScript with React & Global State Management',
            description: 'Strict typing for props, state, generics in React, and global stores with Zustand.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'fed-t2-ts-generics',
                title: 'TypeScript Generics & Strict Typing in React Components',
                summary: 'Write reusable, type-safe components using TypeScript generics, union types, and Discriminated Unions.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'TypeScript adds static type verification to JavaScript, eliminating runtime errors like "Cannot read properties of undefined". Generics allow components to handle variable data types while retaining strict type safety.',
                  keyConcepts: ['Generic Components (Table<T>)', 'Discriminated Unions for state machines', 'Utility Types (Partial, Pick, Omit, Record)', 'Strict null checks'],
                  detailedNotes: `Discriminated Unions for Clean State:
Instead of maintaining multiple flags ({ isLoading, isError, data, error }), use a discriminated union:
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
This guarantees that data is only accessible when status === 'success'.`,
                  codeSnippet: {
                    language: 'typescript',
                    code: `// Generic Type-Safe Select Component in React
interface Option<T> {
  label: string;
  value: T;
}

interface SelectProps<T> {
  options: Option<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

export function Select<T extends string | number>({
  options,
  selectedValue,
  onSelect
}: SelectProps<T>) {
  return (
    <select
      value={selectedValue}
      onChange={(e) => onSelect(e.target.value as unknown as T)}
    >
      {options.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}`,
                    explanation: 'The generic type parameter T ensures that whatever type passes in as options is enforced on the onSelect callback.',
                  },
                  practicalExamples: ['State machines: Using status unions prevents contradictory UI states like showing both a loading spinner and error alert.'],
                  stepByStep: ['Step 1: Define clear interfaces for component props.', 'Step 2: Introduce type generics for data-bound components like tables and dropdowns.', 'Step 3: Enable strict: true in tsconfig.json.'],
                  practiceExercises: [
                    {
                      id: 'ex-ts-discriminated',
                      question: 'Define a TypeScript Discriminated Union for an API response that can either be Success with a payload or Failure with an error message.',
                      initialCode: `type ApiResponse<T> = /* define union */;`,
                      solution: `type ApiResponse<T> =\n  | { success: true; data: T }\n  | { success: false; error: string; statusCode: number };`,
                      hints: ['Use success: true and success: false as the discriminator field'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the purpose of TypeScript Generics?',
                      answer: 'Generics enable the creation of reusable, flexible code components that can work with a variety of data types while preserving full compile-time type safety, rather than falling back to the unsafe any type.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'TypeScript generics turn UI components into reusable, statically-typed building blocks.',
                },
                freeCourses: [
                  {
                    title: 'TypeScript for JavaScript Developers Handbook',
                    provider: 'Microsoft Learn',
                    url: 'https://learn.microsoft.com/en-us/training/paths/build-javascript-applications-typescript/',
                    skillCovered: 'Types, Interfaces, Generics, Compiler Config',
                    level: 'Intermediate',
                    duration: '15 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Web Performance, Next.js & Testing',
        description: 'Server-side rendering, Core Web Vitals optimization, bundle analysis, and automated end-to-end testing with Playwright.',
        modules: [
          {
            moduleId: 'fed-m3-perf-next',
            title: 'Core Web Vitals Optimization & Production Testing',
            description: 'LCP, FID/INP, CLS optimization, dynamic code splitting, and automated E2E testing.',
            estimatedHours: 45,
            topics: [
              {
                topicId: 'fed-t3-web-vitals',
                title: 'Core Web Vitals: LCP, INP & CLS Architectural Optimization',
                summary: 'Measure and systematically improve Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Core Web Vitals are Google official standardized metrics measuring real-world user experience for loading performance, interactivity, and visual stability.',
                  keyConcepts: ['Largest Contentful Paint (LCP) < 2.5s', 'Interaction to Next Paint (INP) < 200ms', 'Cumulative Layout Shift (CLS) < 0.1', 'Critical Rendering Path & Resource Hints (preload, preconnect)', 'Code Splitting with dynamic import()'],
                  detailedNotes: `Core Web Vitals Blueprint:
1. LCP (Loading): Optimize hero images using modern formats (WebP/AVIF), priority hints (fetchpriority="high"), and avoid client-rendered render-blocking JavaScript.
2. INP (Interactivity): Break long tasks (> 50ms) using requestAnimationFrame, scheduler.yield(), or Web Workers to keep the main thread responsive.
3. CLS (Visual Stability): Always declare explicit width and height aspect ratios on images and reserve skeleton dimensions for dynamically injected banners.`,
                  codeSnippet: {
                    language: 'html',
                    code: `<!-- High-Priority LCP Hero Asset & Preconnect -->
<link rel="preconnect" href="https://assets.skillproof.ai">
<link rel="preload" as="image" href="/hero-poster.webp" fetchpriority="high">

<!-- Layout Shift Prevention with Explicit Dimensions -->
<img
  src="/hero-poster.webp"
  alt="Platform Telemetry"
  width="1200"
  height="630"
  style="width: 100%; height: auto; aspect-ratio: 1200 / 630;"
  loading="eager"
>`,
                    explanation: 'Preloading and explicit aspect ratios guarantee the browser allocates space before the image arrives, eliminating CLS.',
                  },
                  practicalExamples: ['Dynamic imports: lazy-load heavy charting or PDF export libraries only when the user opens that tab.'],
                  stepByStep: ['Step 1: Audit pages using Chrome DevTools Performance panel.', 'Step 2: Identify and eliminate layout shifts by reserving aspect ratio dimensions.', 'Step 3: Code-split routes and modals using React.lazy().'],
                  practiceExercises: [
                    {
                      id: 'ex-lazy-component',
                      question: 'Write a React component that lazily loads a heavy ChartViewer component with a fallback skeleton.',
                      initialCode: `// Implement lazy loading with React.Suspense`,
                      solution: `import React, { lazy, Suspense } from 'react';\nconst ChartViewer = lazy(() => import('./ChartViewer'));\n\nexport const Dashboard = () => (\n  <Suspense fallback={<div className="skeleton-loader" />}>\n    <ChartViewer />\n  </Suspense>\n);`,
                      hints: ['Use React.lazy(() => import(...))', 'Wrap in <Suspense fallback={...}>'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between Cumulative Layout Shift (CLS) and Largest Contentful Paint (LCP)?',
                      answer: 'LCP measures perceived load speed by timing when the largest visible content block finishes rendering. CLS measures visual stability by calculating the sum of all unexpected layout shifts occurring during the page lifecycle.',
                      difficulty: 'Advanced',
                    },
                  ],
                  summaryNotes: 'Core Web Vitals are critical for both technical search engine rankings and real-world conversion rates.',
                },
                freeCourses: [
                  {
                    title: 'Web.dev: Learn Core Web Vitals',
                    provider: 'Google Chrome Team',
                    url: 'https://web.dev/learn/performance/',
                    skillCovered: 'LCP, INP, CLS, Browser Rendering Pipeline',
                    level: 'Advanced',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'High-Performance Enterprise Design System & Accessible Analytics Dashboard',
      description: 'Develop a responsive, accessible component library and real-time candidate passport viewer scoring 95+ across all Lighthouse metrics.',
      requirements: ['TypeScript & Strict React 18+', 'Zero CLS with custom skeleton states', 'WCAG 2.1 AA accessibility compliance', 'Automated E2E test suite in Playwright'],
    },
    skillAssessment: {
      title: 'Frontend Architecture & Performance Standardized Examination',
      description: 'Evaluates React rendering performance, TypeScript generics, DOM mechanics, and CSS layout architecture.',
      recommendedAssessmentId: 'frontend-arch-01',
    },
  },

  // 3. BACKEND DEVELOPER
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    description: 'Master server-side engineering, high-throughput distributed microservices, relational and NoSQL database modeling, API gateways, caching with Redis, message queues, and security.',
    category: 'Backend & Systems',
    icon: 'Server',
    estimatedDuration: '6 - 8 Months',
    status: 'published',
    requiredSkills: ['Node.js/Go', 'Express.js/Nest.js', 'PostgreSQL & MongoDB', 'Redis Caching', 'Docker & Kubernetes', 'Kafka/RabbitMQ', 'System Architecture', 'API Security (OAuth2/JWT)'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: Server Fundamentals & Database Foundations',
        description: 'Server architecture, HTTP lifecycle, basic SQL, document databases, and CRUD API development.',
        modules: [
          {
            moduleId: 'bed-m1-server-sql',
            title: 'Server Runtimes & Relational Databases (PostgreSQL)',
            description: 'Relational data modeling, ACID properties, foreign keys, joins, and SQL normalization.',
            estimatedHours: 35,
            topics: [
              {
                topicId: 'bed-t1-acid-sql',
                title: 'ACID Transactions, Relational Schema Normalization & Joins',
                summary: 'Master Atomicity, Consistency, Isolation, Durability, 3NF normalization, and complex SQL joins.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Relational database management systems (RDBMS) like PostgreSQL guarantee reliable transactions using ACID properties. Structuring data into Third Normal Form (3NF) prevents duplication and update anomalies.',
                  keyConcepts: ['ACID Properties', 'Primary Keys & Foreign Key Constraints', 'INNER, LEFT, RIGHT, and FULL OUTER JOINs', 'Normalization (1NF, 2NF, 3NF)', 'Database Transactions (BEGIN, COMMIT, ROLLBACK)'],
                  detailedNotes: `ACID Breakdown:
- Atomicity: All statements in a transaction succeed, or the entire transaction is rolled back (all-or-nothing).
- Consistency: Transactions transition the database from one valid state to another, preserving constraints and triggers.
- Isolation: Concurrent transactions execute without cross-contamination. Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.
- Durability: Once committed, state changes persist even in the event of hardware power failure.`,
                  codeSnippet: {
                    language: 'sql',
                    code: `-- Safe Money Transfer with ACID Transaction in PostgreSQL
BEGIN;

UPDATE accounts
SET balance = balance - 500
WHERE account_id = 'ACC-01' AND balance >= 500;

-- Check if row was updated; if not, rollback
UPDATE accounts
SET balance = balance + 500
WHERE account_id = 'ACC-02';

INSERT INTO transaction_audit (from_acc, to_acc, amount, timestamp)
VALUES ('ACC-01', 'ACC-02', 500, NOW());

COMMIT;`,
                    explanation: 'Wrapping multiple updates inside BEGIN ... COMMIT guarantees that either both accounts update or neither does.',
                  },
                  practicalExamples: ['Foreign keys: ON DELETE CASCADE automatically removes dependent records when parent is deleted.'],
                  stepByStep: ['Step 1: Design entities with distinct primary keys.', 'Step 2: Establish relations using foreign keys.', 'Step 3: Enclose dependent multi-table writes inside database transactions.'],
                  practiceExercises: [
                    {
                      id: 'ex-sql-join',
                      question: 'Write a SQL query that retrieves each student full name and their verified assessment score, including students who have not yet taken any assessments.',
                      initialCode: `SELECT ... FROM students ...`,
                      solution: `SELECT s.full_name, a.score\nFROM students s\nLEFT JOIN assessment_attempts a\n  ON s.id = a.student_id AND a.status = 'verified';`,
                      hints: ['Use LEFT JOIN to retain students without attempts', 'Join on student_id'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between a clustered and non-clustered index in SQL?',
                      answer: 'A clustered index determines the physical order of data rows stored on disk (only one clustered index per table, typically the primary key). A non-clustered index stores index keys separately with pointers back to the actual data rows.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'ACID transactions are vital whenever financial, authentication, or enterprise audit integrity is required.',
                },
                freeCourses: [
                  {
                    title: 'PostgreSQL Official Tutorial & Documentation',
                    provider: 'PostgreSQL Global Development Group',
                    url: 'https://www.postgresql.org/docs/current/tutorial.html',
                    skillCovered: 'SQL Syntax, Relational Modeling, Transactions',
                    level: 'Beginner',
                    duration: '25 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: In-Memory Caching & Distributed Message Queues',
        description: 'Redis caching strategies, cache invalidation, rate limiting, and asynchronous job processing with RabbitMQ/Kafka.',
        modules: [
          {
            moduleId: 'bed-m2-redis-queue',
            title: 'Redis Caching & Asynchronous Queue Architectures',
            description: 'Cache-aside patterns, TTL, BullMQ/RabbitMQ message brokers, and background workers.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'bed-t2-redis-cache',
                title: 'High-Throughput In-Memory Caching with Redis',
                summary: 'Implement Cache-Aside, Write-Through, Redis data structures, eviction policies, and distributed rate limiting.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Redis is an open-source, in-memory data store used as a database, cache, message broker, and streaming engine. Sub-millisecond response times make it ideal for high-throughput API caching.',
                  keyConcepts: ['Cache-Aside (Lazy Loading) Pattern', 'Time-to-Live (TTL) expiration', 'Cache Stampede & Cache Penetration prevention', 'Redis Data Types: Strings, Hashes, Sets, Sorted Sets', 'Sliding Window Rate Limiting'],
                  detailedNotes: `Cache-Aside Pattern Implementation:
1. Application receives read request for key.
2. App queries Redis:
   - Cache HIT: Return cached data immediately.
   - Cache MISS: Query primary database (PostgreSQL/MongoDB), write result into Redis with a defined TTL, and return data to client.
3. On write/update, invalidate (delete) the Redis cache key to avoid stale reads.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// Resilient Cache-Aside Pattern in Node.js
async function getStudentPassportCached(studentId) {
  const cacheKey = \`passport:\${studentId}\`;

  // 1. Check Redis cache
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Fallback to Primary DB on Cache Miss
  const passport = await SkillPassport.findOne({ student: studentId });
  if (passport) {
    // 3. Store in cache with 15-minute TTL
    await redisClient.set(cacheKey, JSON.stringify(passport), { EX: 900 });
  }

  return passport;
}`,
                    explanation: 'The EX option enforces an expiration time (TTL) in seconds, ensuring that stale records expire automatically.',
                  },
                  practicalExamples: ['Rate limiting: Use Redis INCR with EXPIRE to limit client IPs to 100 requests per minute.'],
                  stepByStep: ['Step 1: Check in-memory Redis cache first.', 'Step 2: Read from persistent DB on cache miss.', 'Step 3: Write back to cache with TTL.', 'Step 4: Delete cache key whenever the record is updated.'],
                  practiceExercises: [
                    {
                      id: 'ex-redis-invalidate',
                      question: 'Write an updatePassport function that updates the database and immediately evicts the corresponding Redis cache key.',
                      initialCode: `async function updatePassport(studentId, updates) {\n  // your code\n}`,
                      solution: `async function updatePassport(studentId, updates) {\n  const updated = await SkillPassport.findOneAndUpdate({ student: studentId }, updates, { new: true });\n  await redisClient.del(\`passport:\${studentId}\`);\n  return updated;\n}`,
                      hints: ['Update DB first', 'Call redisClient.del() with the exact cache key'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'How do you prevent a Cache Stampede (Thundering Herd problem)?',
                      answer: 'A cache stampede occurs when a high-traffic key expires, causing thousands of concurrent requests to hit the database simultaneously. It is mitigated using probabilistic early expiration (XFetch algorithm), mutex locks (distributed lock on cache miss), or background cache refreshing.',
                      difficulty: 'Advanced',
                    },
                  ],
                  summaryNotes: 'In-memory caching with Redis protects database backends from query saturation during high-traffic spikes.',
                },
                freeCourses: [
                  {
                    title: 'Redis University: Redis for Developers',
                    provider: 'Redis University',
                    url: 'https://university.redis.io/',
                    skillCovered: 'Redis Data Types, Caching Patterns, Streams',
                    level: 'Intermediate',
                    duration: '15 Hours',
                    isFree: true,
                    hasCertificate: true,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Microservices Architecture & System Design',
        description: 'Microservices decomposition, gRPC, API gateways, database sharding, CQRS, and distributed consensus.',
        modules: [
          {
            moduleId: 'bed-m3-system-design',
            title: 'Distributed System Design & Microservice Patterns',
            description: 'CAP theorem, database sharding, event-driven architecture, and zero-downtime deployments.',
            estimatedHours: 50,
            topics: [
              {
                topicId: 'bed-t3-cap-theorem',
                title: 'The CAP Theorem, Eventual Consistency & Distributed Transactions',
                summary: 'Evaluate tradeoffs between Consistency, Availability, and Partition Tolerance in distributed architectures.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'The CAP Theorem states that in the event of a network partition, a distributed system must choose between Consistency (all nodes return the exact same latest data) and Availability (every request receives a non-error response).',
                  keyConcepts: ['CAP Theorem (Consistency, Availability, Partition Tolerance)', 'PACELC Theorem', 'Saga Pattern for distributed transactions', 'Eventual Consistency & CRDTs', 'Idempotency in API design'],
                  detailedNotes: `Distributed Patterns:
- CP Systems (e.g., MongoDB with majority write concern, Spanner): Choose Consistency over Availability. If a network split occurs, partitioned nodes reject writes.
- AP Systems (e.g., DynamoDB, Cassandra): Choose Availability over strict Consistency. Nodes accept writes locally and reconcile asynchronously (eventual consistency).
- Saga Pattern: Breaks a multi-service business transaction into a series of local transactions coordinated via events. If a step fails, compensating transactions are triggered to undo preceding state.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// Idempotent Event Processing Pattern
async function handlePaymentCompletedEvent(event) {
  const { eventId, transactionId, amount } = event;

  // Check if event was already processed (deduplication)
  const existing = await ProcessedEvent.findOne({ eventId });
  if (existing) {
    console.log(\`[Event Idempotency]: Event \${eventId} already processed. Skipping.\`);
    return;
  }

  // Execute local business transaction
  await UserAccount.updateOne({ _id: event.userId }, { $inc: { credits: amount } });

  // Record event processing in the same transaction
  await ProcessedEvent.create({ eventId, processedAt: new Date() });
}`,
                    explanation: 'Idempotent consumers guarantee that re-delivered messages do not lead to duplicated financial charges or corrupted state.',
                  },
                  practicalExamples: ['Idempotency keys: Pass Idempotency-Key header on payment requests to prevent double charges on network timeouts.'],
                  stepByStep: ['Step 1: Identify critical paths requiring immediate vs eventual consistency.', 'Step 2: Replace distributed 2-Phase Commit with Choreographed or Orchestrated Sagas.', 'Step 3: Ensure all event consumers implement idempotent deduplication.'],
                  practiceExercises: [
                    {
                      id: 'ex-idempotency',
                      question: 'Write an Express middleware that checks an Idempotency-Key header against Redis before allowing the request to proceed.',
                      initialCode: `function idempotencyCheck(req, res, next) {\n  // your code\n}`,
                      solution: `async function idempotencyCheck(req, res, next) {\n  const key = req.headers['idempotency-key'];\n  if (!key) return next();\n  const exists = await redisClient.get(\`idemp:\${key}\`);\n  if (exists) return res.status(409).json({ message: 'Duplicate request in progress' });\n  await redisClient.set(\`idemp:\${key}\`, 'locked', { EX: 60 });\n  next();\n}`,
                      hints: ['Check req.headers["idempotency-key"]', 'Use Redis to lock the key for a short window'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the Saga Pattern and why is it preferred over Two-Phase Commit (2PC) in microservices?',
                      answer: 'Two-Phase Commit is a synchronous, blocking protocol that causes poor availability and high latency in distributed cloud environments. The Saga pattern executes a series of asynchronous local transactions with compensating rollbacks, ensuring resilience without holding database locks across services.',
                      difficulty: 'Advanced',
                    },
                  ],
                  summaryNotes: 'Modern distributed backends favor eventual consistency and asynchronous Sagas over monolithic blocking locks.',
                },
                freeCourses: [
                  {
                    title: 'System Design Primer by Donne Martin',
                    provider: 'GitHub Open Source',
                    url: 'https://github.com/donnemartin/system-design-primer',
                    skillCovered: 'CAP Theorem, Load Balancing, Caching, Sharding',
                    level: 'Advanced',
                    duration: '40 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'Distributed Microservices Assessment & Telemetry Processing Engine',
      description: 'Architect a high-throughput backend with API Gateway, Redis caching, message queue for background integrity audits, and PostgreSQL transactions.',
      requirements: ['gRPC / REST API Gateway with rate limiting', 'Idempotent message consumers with RabbitMQ', 'ACID compliant PostgreSQL database schema', 'Distributed tracing with OpenTelemetry'],
    },
    skillAssessment: {
      title: 'Backend Systems, Microservices & Databases Standardized Examination',
      description: 'Evaluates SQL query optimization, distributed caching, ACID transactions, and system design tradeoffs.',
      recommendedAssessmentId: 'backend-eng-01',
    },
  },

  // 4. JAVA DEVELOPER
  {
    slug: 'java-developer',
    title: 'Java Developer',
    description: 'Master enterprise Java engineering, Object-Oriented Design, Collections, Multithreading, Spring Boot 3, Hibernate ORM, Microservices with Spring Cloud, and JVM performance tuning.',
    category: 'Software Engineering',
    icon: 'Coffee',
    estimatedDuration: '6 - 9 Months',
    status: 'published',
    requiredSkills: ['Java 17/21', 'OOP & Design Patterns', 'Collections & Streams API', 'Concurrency & Multithreading', 'Spring Boot 3', 'Spring Data JPA/Hibernate', 'Maven/Gradle', 'JUnit 5 & Mockito'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: Java Core, OOP & Memory Management',
        description: 'Java language fundamentals, OOP principles (Encapsulation, Inheritance, Polymorphism, Abstraction), JVM architecture, and Collections.',
        modules: [
          {
            moduleId: 'jav-m1-core-oop',
            title: 'Java Core Language, Collections Framework & Streams',
            description: 'Generics, ArrayList vs LinkedList, HashMap internals, and functional Streams API.',
            estimatedHours: 35,
            topics: [
              {
                topicId: 'jav-t1-hashmap-streams',
                title: 'Java Collections Internals: HashMap Architecture & Streams API',
                summary: 'Understand HashMap hashing, bucket collisions, Treeify threshold, and declarative data processing with Java Streams.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'The Java Collections Framework provides standardized data structures. Understanding the internal implementation of HashMap (hash code calculation, bucket array, linked lists and red-black trees) is fundamental to writing high-performance enterprise Java.',
                  keyConcepts: ['hashCode() and equals() contract', 'HashMap Bucket array & Treeification threshold (8)', 'Streams API (filter, map, reduce, collect)', 'Thread safety: HashMap vs ConcurrentHashMap'],
                  detailedNotes: `HashMap Internals (Java 8+):
1. Default initial capacity is 16, with a default load factor of 0.75.
2. When put(key, value) is invoked, hash(key) calculates the bucket index: (n - 1) & hash.
3. If multiple keys resolve to the same index (collision), items are stored in a LinkedList.
4. When bucket length exceeds TREEIFY_THRESHOLD (8) and total capacity >= 64, the list converts to a Red-Black Tree, reducing lookup time from O(N) to O(log N).
5. Crucial Contract: If two objects are equal according to equals(), their hashCode() MUST be identical.`,
                  codeSnippet: {
                    language: 'java',
                    code: `// High-Performance Stream Pipeline in Java 21
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CandidateAnalytics {
    public static Map<String, Double> calculateAverageScoreByDepartment(List<Candidate> candidates) {
        return candidates.stream()
            .filter(Candidate::isVerified)
            .collect(Collectors.groupingBy(
                Candidate::getDepartment,
                Collectors.averagingDouble(Candidate::getAssessmentScore)
            ));
    }
}`,
                    explanation: 'The Streams pipeline declarative groupingBy and averagingDouble eliminates error-prone manual loop counters.',
                  },
                  practicalExamples: ['Always override both equals() and hashCode() when using custom classes as HashMap keys.'],
                  stepByStep: ['Step 1: Understand memory allocation in Java Heap vs Stack.', 'Step 2: Implement equals and hashCode contracts on domain models.', 'Step 3: Replace imperative for-loops with declarative Streams.'],
                  practiceExercises: [
                    {
                      id: 'ex-java-stream',
                      question: 'Write a Java Stream expression that takes a list of integers, filters out odd numbers, squares the even numbers, and returns the sum.',
                      initialCode: `public int sumOfEvenSquares(List<Integer> numbers) {\n    // implement with Stream\n}`,
                      solution: `public int sumOfEvenSquares(List<Integer> numbers) {\n    return numbers.stream()\n        .filter(n -> n % 2 == 0)\n        .mapToInt(n -> n * n)\n        .sum();\n}`,
                      hints: ['filter(n -> n % 2 == 0)', 'mapToInt(n -> n * n)', 'sum()'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What happens if two different objects return the same hashCode() in Java?',
                      answer: 'A hash collision occurs. Both objects are stored in the same hash bucket. In Java 8+, they are initially chained in a linked list and looked up using equals(). If collisions in that bucket exceed 8 and table capacity is >= 64, the bucket is transformed into a balanced Red-Black Tree.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Mastering the equals/hashCode contract and Streams API is foundational for every enterprise Java developer.',
                },
                freeCourses: [
                  {
                    title: 'Oracle Official Java Learning Path & Tutorials',
                    provider: 'Oracle Dev.java',
                    url: 'https://dev.java/learn/',
                    skillCovered: 'Core Java, Collections, OOP, Streams',
                    level: 'Beginner',
                    duration: '30 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Spring Boot 3, Hibernate & REST Services',
        description: 'Inversion of Control (IoC), Dependency Injection, Spring Data JPA, Hibernate caching, and RESTful service architecture.',
        modules: [
          {
            moduleId: 'jav-m2-spring-boot',
            title: 'Spring Boot 3, JPA/Hibernate & Transaction Management',
            description: 'Spring container, @Autowired/@Inject, Hibernate N+1 problem resolution, and @Transactional boundaries.',
            estimatedHours: 45,
            topics: [
              {
                topicId: 'jav-t2-jpa-transactions',
                title: 'Spring Data JPA, Hibernate N+1 Problem & @Transactional',
                summary: 'Solve the N+1 query problem using JOIN FETCH, configure transaction propagation, and manage persistence contexts.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Spring Data JPA significantly reduces boilerplate database access code. However, improper relationship mapping (e.g., LAZY fetch on @OneToMany) can cause the N+1 query performance catastrophe.',
                  keyConcepts: ['Hibernate Persistence Context & Entity States (Transient, Managed, Detached)', 'The N+1 Select Problem and JOIN FETCH resolution', '@Transactional propagation (REQUIRED, REQUIRES_NEW)', 'Spring Boot Auto-configuration & Application Context'],
                  detailedNotes: `Solving the N+1 Query Problem:
When querying a list of N students with their certificates, lazy fetching executes 1 initial query to get students, followed by N separate queries to fetch each student's certificates (1 + N queries).
Solution: Use JOIN FETCH in JPQL or @EntityGraph:
@Query("SELECT s FROM Student s LEFT JOIN FETCH s.certificates")
List<Student> findAllWithCertificates();
This retrieves all students and their associated certificates in a single SQL query.`,
                  codeSnippet: {
                    language: 'java',
                    code: `@Service
public class AssessmentService {
    private final AssessmentRepository assessmentRepo;

    public AssessmentService(AssessmentRepository assessmentRepo) {
        this.assessmentRepo = assessmentRepo;
    }

    @Transactional(readOnly = true)
    public List<Assessment> getActiveAssessments() {
        return assessmentRepo.findAllWithQuestions();
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
    public AssessmentAttempt submitAttempt(AttemptRequest request) {
        // Business logic execution
        return attemptRepo.save(attempt);
    }
}`,
                    explanation: 'Constructor injection is preferred over field @Autowired for testability and immutability. readOnly=true optimizes Hibernate dirty checking.',
                  },
                  practicalExamples: ['Use readOnly = true on GET queries to avoid unnecessary Hibernate snapshot memory allocation.'],
                  stepByStep: ['Step 1: Define JPA entities with appropriate @OneToMany and @ManyToOne relationships.', 'Step 2: Inspect generated SQL queries using spring.jpa.show-sql=true.', 'Step 3: Resolve N+1 issues with JOIN FETCH.'],
                  practiceExercises: [
                    {
                      id: 'ex-jpa-join-fetch',
                      question: 'Write a Spring Data JPA repository method using @Query and JOIN FETCH to load a Department with all its Students in a single query.',
                      initialCode: `@Query("...")\nOptional<Department> findByIdWithStudents(Long id);`,
                      solution: `@Query("SELECT d FROM Department d LEFT JOIN FETCH d.students WHERE d.id = :id")\nOptional<Department> findByIdWithStudents(@Param("id") Long id);`,
                      hints: ['Use LEFT JOIN FETCH d.students', 'Match parameter with :id'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between @Transactional(propagation = Propagation.REQUIRED) and Propagation.REQUIRES_NEW?',
                      answer: 'Propagation.REQUIRED joins an existing transaction if one is present, or creates a new one if none exists. Propagation.REQUIRES_NEW suspends any existing transaction and always initiates an independent, distinct transaction that commits or rolls back independently.',
                      difficulty: 'Advanced',
                    },
                  ],
                  summaryNotes: 'Always monitor generated SQL and utilize JOIN FETCH to maintain sub-millisecond database response times in Spring Boot.',
                },
                freeCourses: [
                  {
                    title: 'Building RESTful Web Services with Spring Boot',
                    provider: 'Spring Official Guides',
                    url: 'https://spring.io/guides/gs/rest-service/',
                    skillCovered: 'Spring Boot 3, Dependency Injection, REST APIs',
                    level: 'Intermediate',
                    duration: '15 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Concurrency, Virtual Threads & Microservices',
        description: 'Java 21 Virtual Threads (Project Loom), concurrent data structures, Spring Cloud, Resilience4j circuit breakers, and JVM tuning.',
        modules: [
          {
            moduleId: 'jav-m3-loom-cloud',
            title: 'Virtual Threads (Java 21) & Spring Cloud Resilient Architecture',
            description: 'High-throughput concurrency with Virtual Threads, Circuit Breakers with Resilience4j, and Eureka Service Discovery.',
            estimatedHours: 50,
            topics: [
              {
                topicId: 'jav-t3-virtual-threads',
                title: 'Java 21 Virtual Threads & Non-blocking High-Throughput Concurrency',
                summary: 'Leverage lightweight Virtual Threads to handle millions of concurrent connections without reactive framework overhead.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Traditional Java threads map 1:1 to operating system kernel threads, making them expensive in memory (~1MB stack) and context switching. Java 21 Virtual Threads (Project Loom) decouple Java threads from OS carrier threads, enabling millions of lightweight threads.',
                  keyConcepts: ['Platform Threads vs Virtual Threads', 'Continuation and Carrier Threads', 'Thread Pinning (avoiding synchronized blocks)', 'Structured Concurrency in Java 21', 'Resilience4j Circuit Breaker patterns'],
                  detailedNotes: `Virtual Threads Characteristics:
- Created in user space by the JVM rather than the OS kernel.
- Stack memory starts at just a few hundred bytes and grows dynamically.
- When a virtual thread performs blocking I/O (e.g., database query or HTTP call), the JVM unmounts it from the underlying carrier thread, allowing other virtual threads to execute.
- Pinning Caveat: Avoid synchronized blocks around blocking I/O; replace with java.util.concurrent.locks.ReentrantLock to avoid pinning the carrier thread.`,
                  codeSnippet: {
                    language: 'java',
                    code: `// Starting Virtual Threads in Java 21
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            // Blocking I/O operation executed with zero platform thread penalty
            Thread.sleep(Duration.ofSeconds(1));
            return "Task " + i + " completed";
        });
    });
} // Auto-waits for all submitted tasks to conclude upon block exit`,
                    explanation: 'The newVirtualThreadPerTaskExecutor allows writing simple synchronous blocking code that scales to tens of thousands of concurrent requests.',
                  },
                  practicalExamples: ['Enable in Spring Boot 3.2+: spring.threads.virtual.enabled=true to process web requests using virtual threads automatically.'],
                  stepByStep: ['Step 1: Upgrade runtime to OpenJDK 21 LTS.', 'Step 2: Enable virtual threads in Spring Boot application.properties.', 'Step 3: Audit codebase to replace synchronized blocks with ReentrantLock.'],
                  practiceExercises: [
                    {
                      id: 'ex-virtual-threads',
                      question: 'Write a snippet using Executors.newVirtualThreadPerTaskExecutor to concurrently fetch telemetry for 100 candidate IDs.',
                      initialCode: `// Implement with virtual thread executor`,
                      solution: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    candidateIds.forEach(id -> executor.submit(() -> fetchTelemetry(id)));\n}`,
                      hints: ['Use try-with-resources with newVirtualThreadPerTaskExecutor()'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is Thread Pinning in Java Virtual Threads and how do you resolve it?',
                      answer: 'Thread Pinning occurs when a virtual thread cannot be unmounted from its underlying carrier thread during blocking I/O because it is executing inside a synchronized block or native method. It is resolved by replacing synchronized blocks with ReentrantLock from java.util.concurrent.locks.',
                      difficulty: 'Advanced',
                    },
                  ],
                  summaryNotes: 'Java 21 Virtual Threads revolutionize server scalability by delivering reactive-level throughput with straightforward synchronous code.',
                },
                freeCourses: [
                  {
                    title: 'Java 21 Features & Concurrency Guide',
                    provider: 'Oracle Dev.java',
                    url: 'https://dev.java/learn/modern-features/',
                    skillCovered: 'Virtual Threads, Pattern Matching, Records',
                    level: 'Advanced',
                    duration: '15 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'Enterprise Distributed Banking & Assessment Platform with Spring Boot',
      description: 'Architect a Spring Boot 3 microservice ecosystem featuring Spring Cloud Gateway, PostgreSQL ACID transactions, Resilience4j circuit breakers, and Virtual Threads.',
      requirements: ['Spring Boot 3.x with Java 21 LTS', 'Spring Data JPA with zero N+1 queries', 'JWT Security with Role-Based Access Control', 'Automated JUnit 5 and Testcontainers integration suite'],
    },
    skillAssessment: {
      title: 'Enterprise Java & Spring Boot Standardized Examination',
      description: 'Evaluates JVM memory architecture, Concurrency, Spring Data JPA performance, and Design Patterns.',
      recommendedAssessmentId: 'java-enterprise-01',
    },
  },

  // 5. PYTHON DEVELOPER
  {
    slug: 'python-developer',
    title: 'Python Developer',
    description: 'Master modern Python engineering from fundamental syntax and data structures to FastAPI high-performance microservices, asynchronous I/O (asyncio), ORMs (SQLAlchemy), Celery task queues, and testing.',
    category: 'Software Engineering',
    icon: 'Terminal',
    estimatedDuration: '5 - 7 Months',
    status: 'published',
    requiredSkills: ['Python 3.11+', 'OOP & Metaprogramming', 'AsyncIO & Concurrency', 'FastAPI & Django', 'SQLAlchemy & Alembic', 'Pytest & TDD', 'Docker & Poetry', 'Celery & Redis'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: Core Python, Data Structures & OOP',
        description: 'Syntax fundamentals, built-in collections (lists, tuples, dicts, sets), comprehensions, generators, and object-oriented principles.',
        modules: [
          {
            moduleId: 'py-m1-core',
            title: 'Python Core Architecture, Data Structures & Generators',
            description: 'Memory model, mutable vs immutable, list/dict comprehensions, decorators, and memory-efficient generators.',
            estimatedHours: 30,
            topics: [
              {
                topicId: 'py-t1-generators-decorators',
                title: 'Python Generators, Decorators & Memory Optimization',
                summary: 'Master yield for lazy evaluation of large datasets, write custom decorators with functools.wraps, and understand Python memory management.',
                estimatedMinutes: 50,
                studyMaterial: {
                  introduction: 'Python generators allow you to declare a function that behaves like an iterator, yielding values on demand rather than loading entire datasets into RAM at once.',
                  keyConcepts: ['Generators & yield keyword (Lazy evaluation)', 'Custom Decorators and @functools.wraps', 'Mutable vs Immutable types (id(), hash())', '*args and **kwargs unpacking'],
                  detailedNotes: `Generators vs Lists:
- A list of 10 million integers requires hundreds of megabytes of RAM.
- A generator expression calculating the same 10 million values consumes less than 100 bytes of memory because it generates each number on-the-fly when requested by next().

Decorators:
Decorators wrap functions to dynamically extend their behavior (logging, authentication, caching, performance timing) without modifying the original source code.`,
                  codeSnippet: {
                    language: 'python',
                    code: `import functools
import time

def timing_decorator(func):
    """Measures execution latency of asynchronous and synchronous functions."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"[Latency]: {func.__name__} took {duration:.4f}s")
        return result
    return wrapper

# Memory-efficient generator streaming records
def stream_large_dataset(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            yield line.strip()`,
                    explanation: 'functools.wraps preserves the original function docstring, name, and signature.',
                  },
                  practicalExamples: ['Processing multi-gigabyte log files: Always use generator lines instead of f.readlines().'],
                  stepByStep: ['Step 1: Replace return with yield for streams.', 'Step 2: Understand decorator closure scope.', 'Step 3: Preserve metadata using functools.wraps.'],
                  practiceExercises: [
                    {
                      id: 'ex-py-decorator',
                      question: 'Write a decorator @retry(max_attempts=3) that retries a failing function up to 3 times before raising the exception.',
                      initialCode: `def retry(max_attempts=3):\n    # implement decorator`,
                      solution: `import functools\n\ndef retry(max_attempts=3):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, max_attempts + 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    if attempt == max_attempts:\n                        raise e\n        return wrapper\n    return decorator`,
                      hints: ['Requires 3 levels of nesting: retry -> decorator -> wrapper', 'Catch Exception and re-raise on last attempt'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the Global Interpreter Lock (GIL) in CPython?',
                      answer: 'The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at the same time in CPython. This ensures thread-safe memory management (reference counting), but means CPU-bound tasks must use multiprocessing rather than multithreading to achieve true parallel execution across multi-core processors.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Generators and decorators are the hallmark of idiomatic, memory-efficient, and maintainable Python code.',
                },
                freeCourses: [
                  {
                    title: 'The Official Python Tutorial',
                    provider: 'Python Software Foundation',
                    url: 'https://docs.python.org/3/tutorial/',
                    skillCovered: 'Data Structures, OOP, Generators, Standard Library',
                    level: 'Beginner',
                    duration: '25 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Asynchronous Python & Modern FastAPI Services',
        description: 'asyncio event loop, asynchronous web frameworks (FastAPI), Pydantic v2 data validation, and SQLAlchemy ORM.',
        modules: [
          {
            moduleId: 'py-m2-fastapi',
            title: 'High-Performance APIs with FastAPI & Asynchronous SQLAlchemy',
            description: 'Async/await syntax, dependency injection in FastAPI, Pydantic data schemas, and Alembic database migrations.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'py-t2-fastapi-async',
                title: 'FastAPI Architecture, Pydantic v2 Validation & AsyncIO',
                summary: 'Build production-ready, auto-documented async REST APIs with FastAPI, Pydantic models, and database connection pooling.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'FastAPI is a modern, high-performance web framework for building APIs with Python 3.8+ based on standard Python type hints. Built on Starlette and Pydantic, it offers native async/await performance on par with NodeJS and Go.',
                  keyConcepts: ['async def vs def route execution', 'Pydantic v2 BaseModels and field validation', 'FastAPI Depends() dependency injection', 'Automatic OpenAPI (Swagger) documentation generation'],
                  detailedNotes: `FastAPI Concurrency Mechanics:
- When you define a route with async def, FastAPI executes it directly in the main asyncio event loop thread. It MUST NOT perform blocking synchronous I/O.
- If you define a route with standard def, FastAPI automatically offloads it to an external thread pool so that blocking calls do not stall the event loop.
- Use async def when interacting with asynchronous database drivers (asyncpg, motor) or HTTP clients (httpx).`,
                  codeSnippet: {
                    language: 'python',
                    code: `from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(title="SkillProof AI Verification Engine", version="1.0.0")

class VerificationRequest(BaseModel):
    student_email: EmailStr
    skill_tag: str = Field(min_length=2, max_length=50)
    score: float = Field(ge=0.0, le=100.0)

@app.post("/api/v1/verify", status_code=status.HTTP_201_CREATED)
async def verify_skill(payload: VerificationRequest):
    if payload.score < 75.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assessment score does not meet standardized verification threshold."
        )
    return {"status": "verified", "student": payload.student_email}`,
                    explanation: 'Pydantic automatically validates types and ranges before the route function executes, rejecting malformed requests with 422 Unprocessable Entity.',
                  },
                  practicalExamples: ['Dependency Injection: Use Depends(get_current_user) to enforce authentication and inject the user object into routes.'],
                  stepByStep: ['Step 1: Define request/response schemas with Pydantic BaseModel.', 'Step 2: Create routes with async def and type-hinted parameters.', 'Step 3: Test endpoints directly using interactive /docs Swagger UI.'],
                  practiceExercises: [
                    {
                      id: 'ex-fastapi-dep',
                      question: 'Write a FastAPI dependency get_api_key that reads an X-API-Key header and validates it against a secret token.',
                      initialCode: `async def get_api_key(...):\n    # implement dependency`,
                      solution: `from fastapi import Header, HTTPException, status\n\nasync def get_api_key(x_api_key: str = Header(...)):\n    if x_api_key != "secret-token-123":\n        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid API Key")\n    return x_api_key`,
                      hints: ['Use Header(...) from fastapi', 'Raise HTTPException(403) on mismatch'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What happens if you run a blocking time.sleep(5) inside an async def FastAPI route?',
                      answer: 'Because async def routes run directly on the main asyncio event loop, a blocking synchronous call like time.sleep() halts the entire event loop thread for 5 seconds, preventing the server from handling ANY other concurrent incoming requests during that time. You should use await asyncio.sleep(5) instead.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'FastAPI combines static type hints, automated data serialization, and asynchronous concurrency into a modern Python API stack.',
                },
                freeCourses: [
                  {
                    title: 'FastAPI Official Documentation & Tutorial',
                    provider: 'FastAPI Official Docs',
                    url: 'https://fastapi.tiangolo.com/tutorial/',
                    skillCovered: 'FastAPI, Pydantic, Async/Await, Security',
                    level: 'Intermediate',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Background Processing, Celery & Microservices',
        description: 'Distributed background job processing with Celery and Redis, automated unit/integration testing with Pytest, and Docker deployment.',
        modules: [
          {
            moduleId: 'py-m3-celery-test',
            title: 'Celery Distributed Task Queues & Pytest TDD Workflows',
            description: 'Asynchronous workers, task scheduling (Celery Beat), fixture architecture in Pytest, and containerization.',
            estimatedHours: 45,
            topics: [
              {
                topicId: 'py-t3-celery-workers',
                title: 'Asynchronous Distributed Processing with Celery & Redis',
                summary: 'Offload long-running computations, report generation, and email dispatches to decoupled background worker processes.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Web servers must respond within milliseconds. Long-running tasks (generating PDF certificates, running ML models, sending emails) should be offloaded to Celery worker clusters via a Redis/RabbitMQ message broker.',
                  keyConcepts: ['Celery Application & Worker Architecture', 'Message Brokers (Redis) & Result Backends', 'Task States (PENDING, STARTED, SUCCESS, FAILURE)', 'Retries with Exponential Backoff', 'Celery Beat for periodic cron jobs'],
                  detailedNotes: `Celery Lifecycle:
1. Producer: Web app calls task.delay(arg1, arg2) which serializes the payload into JSON and pushes it to Redis.
2. Web app immediately returns HTTP 202 Accepted with a task ID to the client.
3. Consumer: Decoupled Celery worker processes pull the task from Redis, execute it in the background, and store the output in the result backend.`,
                  codeSnippet: {
                    language: 'python',
                    code: `from celery import Celery

celery_app = Celery(
    "tasks",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1"
)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_audit_report(self, student_id: str):
    try:
        print(f"Generating institutional report for {student_id}...")
        # Heavy computation / PDF generation
        return {"status": "completed", "file_url": f"/reports/{student_id}.pdf"}
    except Exception as exc:
        raise self.retry(exc=exc)`,
                    explanation: 'bind=True gives the task access to self, allowing self.retry() with exponential backoff on transient failures.',
                  },
                  practicalExamples: ['Background PDF export: Return a jobId to the client so the frontend can poll or await a WebSocket notification upon completion.'],
                  stepByStep: ['Step 1: Initialize Celery instance pointing to Redis broker.', 'Step 2: Define tasks with @celery_app.task.', 'Step 3: Invoke tasks asynchronously using .delay().'],
                  practiceExercises: [
                    {
                      id: 'ex-celery-task',
                      question: 'Write a Celery task send_verification_email that takes an email address and OTP string, simulating delivery.',
                      initialCode: `@celery_app.task\ndef send_verification_email(email, otp):\n    # implement task`,
                      solution: `@celery_app.task(bind=True, max_retries=3)\ndef send_verification_email(self, email, otp):\n    try:\n        # simulate SMTP send\n        print(f"Dispatched {otp} to {email}")\n        return True\n    except Exception as e:\n        raise self.retry(exc=e, countdown=30)`,
                      hints: ['Use bind=True for retry capability', 'countdown=30 sets retry delay'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between Celery .delay() and .apply_async()?',
                      answer: 'delay(*args, **kwargs) is a convenient shortcut for apply_async(args, kwargs). apply_async offers complete control over task execution parameters, including countdown (delay execution), expires, queue selection, and priority.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Celery and Redis decouple heavy computations from request-response cycles, keeping user interfaces snappy and responsive.',
                },
                freeCourses: [
                  {
                    title: 'Testing and Tooling in Python with Pytest',
                    provider: 'Microsoft Learn',
                    url: 'https://learn.microsoft.com/en-us/training/modules/test-python-with-pytest/',
                    skillCovered: 'Pytest, Fixtures, Mocking, TDD',
                    level: 'Advanced',
                    duration: '10 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'High-Throughput Asynchronous Telemetry & Evaluation Service',
      description: 'Build a production microservice with FastAPI, Pydantic v2 schemas, asynchronous PostgreSQL access, Celery workers for PDF generation, and full Pytest coverage.',
      requirements: ['FastAPI async REST endpoints with JWT authorization', 'Celery background workers with Redis broker', 'Pytest test suite scoring > 85% coverage', 'Docker Compose multi-service deployment'],
    },
    skillAssessment: {
      title: 'Python Backend & Concurrency Standardized Examination',
      description: 'Evaluates asynchronous programming with AsyncIO, FastAPI architecture, generators, and Celery task systems.',
      recommendedAssessmentId: 'python-backend-01',
    },
  },

  // 6. DATA ANALYST
  {
    slug: 'data-analyst',
    title: 'Data Analyst',
    description: 'Transform raw data into actionable business intelligence. Master advanced SQL, statistical modeling, Python data manipulation (Pandas, NumPy), data visualization (Tableau, PowerBI), and storytelling.',
    category: 'Data & Analytics',
    icon: 'BarChart2',
    estimatedDuration: '4 - 6 Months',
    status: 'published',
    requiredSkills: ['Advanced SQL & Window Functions', 'Python (Pandas, NumPy, Matplotlib)', 'Exploratory Data Analysis (EDA)', 'Statistical Inference', 'Power BI / Tableau', 'Data Cleaning & ETL'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: SQL for Analytics & Data Manipulation',
        description: 'Relational data querying, aggregation, filtering, group by, and analytical window functions.',
        modules: [
          {
            moduleId: 'da-m1-sql-analytics',
            title: 'Advanced SQL, Window Functions & CTEs',
            description: 'Common Table Expressions (CTEs), ROW_NUMBER, RANK, DENSE_RANK, NTILE, and cohort analysis.',
            estimatedHours: 30,
            topics: [
              {
                topicId: 'da-t1-window-funcs',
                title: 'Analytical Window Functions & Running Totals in SQL',
                summary: 'Master OVER(PARTITION BY ... ORDER BY ...), ranking functions, and running metrics without collapsing rows.',
                estimatedMinutes: 50,
                studyMaterial: {
                  introduction: 'Unlike regular GROUP BY queries that collapse multiple rows into a single summary row, SQL Window Functions perform calculations across a set of table rows related to the current row while retaining individual row identity.',
                  keyConcepts: ['OVER (PARTITION BY ... ORDER BY ...)', 'ROW_NUMBER() vs RANK() vs DENSE_RANK()', 'LEAD() and LAG() for period-over-period comparisons', 'Running Totals and Moving Averages'],
                  detailedNotes: `Ranking Functions Compared:
- ROW_NUMBER(): Assigns a unique sequential integer to each row (1, 2, 3, 4).
- RANK(): Assigns the same rank to ties, but skips subsequent rank numbers (1, 2, 2, 4).
- DENSE_RANK(): Assigns the same rank to ties without skipping subsequent numbers (1, 2, 2, 3).
- LAG(col, 1): Accesses data from the previous row within the partition without a self-join.`,
                  codeSnippet: {
                    language: 'sql',
                    code: `-- Candidate Assessment Cohort Ranking & Running Total
WITH RankedCandidates AS (
    SELECT
        student_id,
        department,
        assessment_score,
        DENSE_RANK() OVER (
            PARTITION BY department
            ORDER BY assessment_score DESC
        ) AS dept_rank,
        AVG(assessment_score) OVER (
            PARTITION BY department
        ) AS dept_average
    FROM assessment_results
)
SELECT * FROM RankedCandidates WHERE dept_rank <= 3;`,
                    explanation: 'The Common Table Expression (CTE) ranks candidates per department, allowing the outer query to filter for the top 3 in each cohort.',
                  },
                  practicalExamples: ['Period-over-period growth: (current_month - LAG(current_month, 1)) / LAG(current_month, 1) * 100.'],
                  stepByStep: ['Step 1: Define the partition boundary using PARTITION BY.', 'Step 2: Define sort criteria inside the OVER clause.', 'Step 3: Wrap window logic inside a CTE for clean filtering.'],
                  practiceExercises: [
                    {
                      id: 'ex-sql-window',
                      question: 'Write a SQL query calculating the running sum of student registrations ordered by registration date.',
                      initialCode: `SELECT date, registrations, ... FROM daily_stats;`,
                      solution: `SELECT\n    date,\n    registrations,\n    SUM(registrations) OVER (ORDER BY date ASC) AS running_total\nFROM daily_stats;`,
                      hints: ['SUM(registrations) OVER (ORDER BY date ASC)'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the practical difference between RANK() and DENSE_RANK() in SQL?',
                      answer: 'When tied values are encountered, RANK() assigns duplicate ranks but skips subsequent values (e.g., 1, 2, 2, 4), whereas DENSE_RANK() assigns duplicate ranks without skipping subsequent values (e.g., 1, 2, 2, 3).',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Window functions enable sophisticated cohort, trend, and ranking analytics directly inside the SQL engine.',
                },
                freeCourses: [
                  {
                    title: 'Mode Analytics: Advanced SQL Window Functions Tutorial',
                    provider: 'Mode Analytics',
                    url: 'https://mode.com/sql-tutorial/sql-window-functions/',
                    skillCovered: 'Window Functions, Subqueries, Joins',
                    level: 'Beginner',
                    duration: '10 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Python Data Analysis with Pandas & NumPy',
        description: 'Data wrangling, cleaning missing values, exploratory data analysis, aggregation, and statistical distributions.',
        modules: [
          {
            moduleId: 'da-m2-pandas-eda',
            title: 'Data Wrangling, Cleansing & EDA with Pandas',
            description: 'DataFrames, missing value imputation, group operations, reshaping with pivot tables, and statistical summaries.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'da-t2-pandas-cleaning',
                title: 'Data Cleaning, Imputation & Vectorized Transformations in Pandas',
                summary: 'Handle missing values, detect outliers, perform vectorized operations, and engineer analytical features.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Real-world data is messy, incomplete, and full of inconsistencies. Pandas provides vectorized data manipulation capabilities to clean, reshape, and transform datasets efficiently.',
                  keyConcepts: ['DataFrames & Series', 'Handling NaNs (dropna vs fillna vs interpolation)', 'Vectorization vs iterrows() performance', 'groupby() and agg() operations', 'Outlier detection using IQR (Interquartile Range)'],
                  detailedNotes: `Why Vectorization Beats Loops in Pandas:
Iterating over DataFrame rows with for loops or iterrows() forces Python to perform type checks on every iteration. Vectorized operations run compiled C code underneath via NumPy, achieving 100x to 1000x speedups.`,
                  codeSnippet: {
                    language: 'python',
                    code: `import pandas as pd
import numpy as np

# Load candidate telemetry dataset
df = pd.read_csv("candidate_telemetry.csv")

# 1. Handle missing values
df["cgpa"] = df["cgpa"].fillna(df["cgpa"].median())

# 2. Outlier Detection using Interquartile Range (IQR)
q1 = df["assessment_score"].quantile(0.25)
q3 = df["assessment_score"].quantile(0.75)
iqr = q3 - q1
lower_bound = q1 - (1.5 * iqr)
upper_bound = q3 + (1.5 * iqr)

df["is_outlier"] = (df["assessment_score"] < lower_bound) | (df["assessment_score"] > upper_bound)

# 3. Vectorized Cohort Aggregation
dept_summary = df.groupby("department").agg(
    total_students=("student_id", "count"),
    avg_score=("assessment_score", "mean"),
    pass_rate=("passed", lambda x: (x == True).mean() * 100)
).reset_index()`,
                    explanation: 'The vectorized operations execute in compiled C/Fortran routines via NumPy, ensuring instant processing of large datasets.',
                  },
                  practicalExamples: ['Never use df.iterrows() for transformations; use df["new_col"] = df["col1"] * df["col2"] or .apply() instead.'],
                  stepByStep: ['Step 1: Inspect summary statistics using df.info() and df.describe().', 'Step 2: Impute missing numerical values using median/mean.', 'Step 3: Remove or flag extreme outliers using the IQR rule.'],
                  practiceExercises: [
                    {
                      id: 'ex-pandas-agg',
                      question: 'Write a Pandas expression to calculate the average and maximum salary per department from a employees DataFrame.',
                      initialCode: `summary = df.groupby(...)...`,
                      solution: `summary = df.groupby('department')['salary'].agg(['mean', 'max']).reset_index()`,
                      hints: ['Group by "department"', 'Aggregate salary with agg(["mean", "max"])'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between loc and iloc in Pandas?',
                      answer: 'loc is label-based, meaning you specify rows and columns by their index labels and column names. iloc is integer position-based, meaning you select rows and columns strictly by their 0-based integer index locations.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Vectorized Pandas operations ensure high-speed data cleaning and reliable exploratory analytics.',
                },
                freeCourses: [
                  {
                    title: 'Data Analysis with Python Certification',
                    provider: 'freeCodeCamp',
                    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
                    skillCovered: 'NumPy, Pandas, Matplotlib, Data Cleaning',
                    level: 'Intermediate',
                    duration: '300 Hours',
                    isFree: true,
                    hasCertificate: true,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Business Intelligence Dashboards & Storytelling',
        description: 'Interactive dashboard engineering in Power BI/Tableau, DAX calculations, statistical hypothesis testing, and stakeholder presentation.',
        modules: [
          {
            moduleId: 'da-m3-bi-dashboards',
            title: 'Interactive Dashboard Design & Hypothesis Testing',
            description: 'Star schema modeling, DAX measures, A/B test analysis, and executive dashboard design.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'da-t3-dax-modeling',
                title: 'Data Modeling (Star Schema) & DAX Measures in Power BI',
                summary: 'Design dimensional models (Fact vs Dimension tables) and calculate complex business KPIs with DAX.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Business Intelligence engines perform best when data is structured in a Star Schema: centralized Fact tables containing numeric metrics connected to surrounding Dimension tables containing descriptive context.',
                  keyConcepts: ['Star Schema vs Snowflake Schema', 'Fact tables (events/transactions) vs Dimension tables (entities)', 'DAX CALCULATE and Filter Context', 'A/B Test Statistical Significance (p-value, t-test)'],
                  detailedNotes: `The Star Schema Advantage:
- Minimizes query complexity by avoiding deep normalized snowflake joins.
- Eliminates circular relationships and ambiguous filter paths.
- Optimizes VertiPaq in-memory compression in Power BI.`,
                  codeSnippet: {
                    language: 'sql',
                    code: `// DAX Measure in Power BI for Year-over-Year Growth
YoY Verification Growth % =
VAR CurrentYearCount = [Total Verified Certifications]
VAR PriorYearCount = CALCULATE(
    [Total Verified Certifications],
    SAMEPERIODLASTYEAR('Calendar'[Date])
)
RETURN
    DIVIDE(CurrentYearCount - PriorYearCount, PriorYearCount, 0)`,
                    explanation: 'The DAX CALCULATE function modifies the filter context, allowing accurate year-over-year comparisons.',
                  },
                  practicalExamples: ['Always use DIVIDE(numerator, denominator, alternate) instead of "/" to prevent divide-by-zero crashes.'],
                  stepByStep: ['Step 1: Separate transactional logs into Fact tables.', 'Step 2: Create date, student, and recruiter Dimension tables.', 'Step 3: Define 1-to-many single-direction relationships from Dimensions to Facts.'],
                  practiceExercises: [
                    {
                      id: 'ex-dax-measure',
                      question: 'Write a DAX measure to calculate the total passed assessments filtered strictly where score >= 75.',
                      initialCode: `PassedCount = ...`,
                      solution: `PassedCount = CALCULATE(COUNTROWS('AssessmentAttempts'), 'AssessmentAttempts'[Score] >= 75)`,
                      hints: ['Use CALCULATE(COUNTROWS(...), filter)'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between an implicit and explicit measure in Power BI?',
                      answer: 'An implicit measure is automatically generated by Power BI when you drag a column into a visual (e.g., Sum of Sales). An explicit measure is a custom DAX calculation defined by the analyst (e.g., Total Sales = SUM(Sales[Amount])). Explicit measures are reusable, auditable, and support complex filter context manipulations.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Star Schema data modeling and explicit DAX measures power interactive, scalable executive dashboards.',
                },
                freeCourses: [
                  {
                    title: 'Microsoft Power BI Data Analyst Training Path',
                    provider: 'Microsoft Learn',
                    url: 'https://learn.microsoft.com/en-us/training/paths/data-analytics-microsoft/',
                    skillCovered: 'Data Modeling, DAX, Power BI Visualizations',
                    level: 'Advanced',
                    duration: '25 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'Institutional Placement & Skill Readiness Executive Intelligence Dashboard',
      description: 'Clean and model a multi-table institutional dataset using advanced SQL and Python Pandas, culminating in an interactive Power BI dashboard featuring cohort analytics.',
      requirements: ['Cleaned dataset with verified imputation and outlier logs', 'Star Schema dimensional model', 'Advanced DAX measures calculating placement conversion rates', 'Executive findings report with actionable recommendations'],
    },
    skillAssessment: {
      title: 'Data Analysis, SQL & Business Intelligence Standardized Examination',
      description: 'Evaluates analytical SQL queries, Pandas wrangling, statistical hypothesis testing, and data modeling.',
      recommendedAssessmentId: 'data-analytics-01',
    },
  },

  // 7. SOFTWARE ENGINEER
  {
    slug: 'software-engineer',
    title: 'Software Engineer',
    description: 'Master core computer science principles, advanced Data Structures & Algorithms, Object-Oriented Design, Operating Systems, Computer Networking, and large-scale System Architecture.',
    category: 'Computer Science',
    icon: 'Cpu',
    estimatedDuration: '6 - 9 Months',
    status: 'published',
    requiredSkills: ['Data Structures & Algorithms', 'System Design & Scalability', 'Object-Oriented Design (SOLID)', 'Operating Systems & Concurrency', 'Computer Networking (TCP/UDP/HTTP)', 'Git & CI/CD Pipelines'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: Data Structures & Algorithmic Complexity',
        description: 'Big-O notation, Arrays, Linked Lists, Stacks, Queues, Hash Tables, and fundamental sorting/searching algorithms.',
        modules: [
          {
            moduleId: 'swe-m1-dsa-basics',
            title: 'Asymptotic Analysis & Core Data Structures',
            description: 'Time & Space complexity (Big-O), pointers, two-pointer techniques, and sliding window paradigms.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'swe-t1-big-o',
                title: 'Asymptotic Complexity (Big-O) & Two-Pointer Algorithmic Patterns',
                summary: 'Analyze algorithm efficiency, eliminate O(N^2) bottlenecks, and master in-place two-pointer transformations.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Software engineering requires selecting the optimal data structure and algorithm for scale. Asymptotic complexity (Big-O) quantifies how time and memory requirements grow as input size N tends toward infinity.',
                  keyConcepts: ['Time Complexity vs Space Complexity', 'Common Orders: O(1), O(log N), O(N), O(N log N), O(N^2)', 'Two-Pointer Technique (Left/Right convergence)', 'Sliding Window optimization'],
                  detailedNotes: `Big-O Complexity Cheat Sheet:
- O(1): Constant time (Hash map lookup, array index access).
- O(log N): Logarithmic time (Binary search).
- O(N): Linear time (Iterating over array once).
- O(N log N): Linearithmic time (Merge Sort, Quick Sort average).
- O(N^2): Quadratic time (Nested loops - avoid in production data pipelines).`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// Two-Pointer Pattern: Two Sum in Sorted Array - O(N) Time, O(1) Space
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const currentSum = numbers[left] + numbers[right];

    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++; // Need a larger value
    } else {
      right--; // Need a smaller value
    }
  }

  return [];
}`,
                    explanation: 'The two-pointer technique solves the problem in O(N) linear time and O(1) memory, replacing the brute-force O(N^2) nested loop.',
                  },
                  practicalExamples: ['In-place array modifications: Use two pointers to remove duplicates without allocating a new array.'],
                  stepByStep: ['Step 1: Determine the theoretical lower bound of the problem.', 'Step 2: Identify whether sorting the input unlocks O(N log N) solutions.', 'Step 3: Analyze worst-case and auxiliary space requirements.'],
                  practiceExercises: [
                    {
                      id: 'ex-two-pointer',
                      question: 'Write a function isPalindrome(s) that verifies if an alphanumeric string reads the same forwards and backwards in O(N) time and O(1) space.',
                      initialCode: `function isPalindrome(s) {\n  // implement with two pointers\n}`,
                      solution: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}`,
                      hints: ['Filter alphanumeric characters', 'Compare characters from outer ends inward'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the time and space complexity of Merge Sort?',
                      answer: 'Merge Sort operates in O(N log N) time complexity in all cases (best, average, and worst) because it divides the array in half log N times and merges N elements at each level. Its auxiliary space complexity is O(N) due to the temporary arrays required during merging.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Algorithmic efficiency distinguishes enterprise software engineering from basic scripting.',
                },
                freeCourses: [
                  {
                    title: 'Algorithms and Data Structures Certification',
                    provider: 'freeCodeCamp',
                    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
                    skillCovered: 'Big-O, Sorting, Searching, Data Structures',
                    level: 'Beginner',
                    duration: '300 Hours',
                    isFree: true,
                    hasCertificate: true,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Advanced Trees, Graphs & Dynamic Programming',
        description: 'Binary Search Trees, Heaps, Graph traversals (BFS, DFS), Dijkstra shortest path, and Dynamic Programming memoization.',
        modules: [
          {
            moduleId: 'swe-m2-graphs-dp',
            title: 'Graph Algorithms & Dynamic Programming Mastery',
            description: 'Adjacency lists, Breadth-First Search, Depth-First Search, Top-down memoization, and Bottom-up tabulation.',
            estimatedHours: 50,
            topics: [
              {
                topicId: 'swe-t2-graph-bfs',
                title: 'Graph Traversal Algorithms: BFS, DFS & Topological Sort',
                summary: 'Represent graphs in code, find shortest paths in unweighted networks using BFS, and resolve build dependencies.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Graphs model networks of relationships (social networks, dependency trees, routing protocols). Breadth-First Search (BFS) and Depth-First Search (DFS) are fundamental graph traversal patterns.',
                  keyConcepts: ['Adjacency List vs Adjacency Matrix representations', 'BFS for Shortest Path in unweighted graphs', 'DFS for Cycle Detection and Maze exploration', 'Topological Sorting for task dependency scheduling'],
                  detailedNotes: `BFS vs DFS Traversal:
- BFS uses a Queue (FIFO) and explores neighbor by neighbor in concentric circles. It is guaranteed to find the shortest path in unweighted graphs.
- DFS uses a Stack (or recursion) and explores as deep as possible along each branch before backtracking. Useful for cycle detection and topological sorting.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// Breadth-First Search (BFS) Shortest Path in Graph
function shortestPathBFS(graph, startNode, targetNode) {
  const queue = [[startNode, 0]]; // [currentNode, distance]
  const visited = new Set([startNode]);

  while (queue.length > 0) {
    const [current, distance] = queue.shift();

    if (current === targetNode) {
      return distance;
    }

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
      }
    }
  }

  return -1; // No path found
}`,
                    explanation: 'The Set tracks visited nodes to prevent infinite loops in cyclic graphs.',
                  },
                  practicalExamples: ['Build systems: Topological sorting resolves package compile order without circular dependency deadlocks.'],
                  stepByStep: ['Step 1: Construct graph representation as an adjacency list.', 'Step 2: Maintain a visited set to avoid infinite loops.', 'Step 3: Utilize a queue for level-order (BFS) or stack/recursion for deep traversal (DFS).'],
                  practiceExercises: [
                    {
                      id: 'ex-bfs-connected',
                      question: 'Write a function countConnectedComponents(n, edges) calculating the number of disconnected subgraphs in an undirected network.',
                      initialCode: `function countConnectedComponents(n, edges) {\n  // implement with BFS or DFS\n}`,
                      solution: `function countConnectedComponents(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const visited = new Set();\n  let count = 0;\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      count++;\n      const q = [i];\n      visited.add(i);\n      while (q.length) {\n        const curr = q.shift();\n        for (const neighbor of adj[curr]) {\n          if (!visited.has(neighbor)) {\n            visited.add(neighbor);\n            q.push(neighbor);\n          }\n        }\n      }\n    }\n  }\n  return count;\n}`,
                      hints: ['Construct adjacency list', 'Iterate through all nodes 0 to n-1', 'Increment counter each time an unvisited node starts a new traversal'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'When is BFS preferred over DFS for finding paths?',
                      answer: 'BFS is strictly preferred when seeking the shortest path in unweighted graphs because it explores all nodes at depth D before inspecting nodes at depth D+1. DFS may traverse deep along a convoluted path and find a suboptimal route first.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Graph traversals model dependency resolution, network routing, and recommendation systems.',
                },
                freeCourses: [
                  {
                    title: 'MIT OpenCourseWare: Introduction to Algorithms',
                    provider: 'MIT OCW',
                    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
                    skillCovered: 'Graph Algorithms, Shortest Paths, Dynamic Programming',
                    level: 'Intermediate',
                    duration: '40 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: System Architecture, SOLID Principles & Design Patterns',
        description: 'Object-Oriented Design (SOLID), Gang of Four Design Patterns, Low-Level Design (LLD), and High-Level Design (HLD).',
        modules: [
          {
            moduleId: 'swe-m3-system-patterns',
            title: 'SOLID Principles & Gang of Four Design Patterns',
            description: 'Factory, Observer, Strategy, Decorator, Adapter patterns, and modular architecture.',
            estimatedHours: 45,
            topics: [
              {
                topicId: 'swe-t3-solid-strategy',
                title: 'SOLID Principles & The Strategy Design Pattern',
                summary: 'Master Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'The SOLID principles are five design guidelines that make software designs understandable, flexible, and maintainable. The Strategy pattern defines a family of interchangeable algorithms, encapsulating each one.',
                  keyConcepts: ['Single Responsibility Principle (SRP)', 'Open/Closed Principle (OCP)', 'Liskov Substitution Principle (LSP)', 'Interface Segregation Principle (ISP)', 'Dependency Inversion Principle (DIP)', 'Strategy Pattern for pluggable algorithms'],
                  detailedNotes: `SOLID Principles:
- S: A class should have one, and only one, reason to change.
- O: Software entities should be open for extension, but closed for modification.
- L: Subtypes must be substitutable for their base types without altering program correctness.
- I: Clients should not be forced to depend upon interfaces they do not use.
- D: High-level modules should not depend on low-level modules; both should depend on abstractions.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// Strategy Pattern: Pluggable Verification Strategies
class StandardProctoringStrategy {
  verifyAttempt(attempt) {
    return attempt.violations === 0;
  }
}

class StrictZeroToleranceStrategy {
  verifyAttempt(attempt) {
    return attempt.violations === 0 && attempt.phoneDetected === false;
  }
}

class AssessmentAuditor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  auditCandidate(attempt) {
    return this.strategy.verifyAttempt(attempt);
  }
}`,
                    explanation: 'The AssessmentAuditor adheres to Open/Closed: new audit strategies can be added without modifying existing auditor code.',
                  },
                  practicalExamples: ['Dependency Inversion: Pass database interfaces into services rather than instantiating concrete database connections inside services.'],
                  stepByStep: ['Step 1: Identify classes with multiple disparate responsibilities.', 'Step 2: Decouple concrete implementations behind clean interfaces.', 'Step 3: Inject dependencies via constructors.'],
                  practiceExercises: [
                    {
                      id: 'ex-solid-ocp',
                      question: 'Refactor a switch statement calculating shipping costs by carrier (FedEx, UPS, DHL) into the Strategy design pattern.',
                      initialCode: `function getShipping(carrier, weight) {\n  switch(carrier) {\n    case 'fedex': return weight * 1.5;\n    case 'ups': return weight * 1.2;\n  }\n}`,
                      solution: `const shippingStrategies = {\n  fedex: (weight) => weight * 1.5,\n  ups: (weight) => weight * 1.2,\n  dhl: (weight) => weight * 1.8\n};\nfunction getShipping(carrier, weight) {\n  const strategy = shippingStrategies[carrier];\n  if (!strategy) throw new Error('Unsupported carrier');\n  return strategy(weight);\n}`,
                      hints: ['Map carriers to strategy functions', 'Eliminate switch statements'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the Liskov Substitution Principle and give an example of its violation?',
                      answer: 'The Liskov Substitution Principle states that objects of a superclass should be replaceable with objects of its subclasses without breaking application behavior. A classic violation is the Square inheriting from Rectangle: setting the width of a Square unexpectedly alters its height, violating the behavior expected of a Rectangle.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Applying SOLID principles ensures codebases remain adaptable to changing business requirements without regression.',
                },
                freeCourses: [
                  {
                    title: 'Refactoring.Guru: Design Patterns Guide',
                    provider: 'Refactoring.Guru',
                    url: 'https://refactoring.guru/design-patterns',
                    skillCovered: 'Creational, Structural & Behavioral Patterns, SOLID',
                    level: 'Advanced',
                    duration: '25 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'High-Concurrency In-Memory Key-Value Store & Distributed Task Scheduler',
      description: 'Build a production-grade multi-threaded in-memory key-value store with TTL expiration, LRU eviction, and an asynchronous graph-based task dependency engine.',
      requirements: ['Thread-safe concurrent data structures', 'Custom LRU cache eviction policy', 'Graph topological sort dependency runner', 'Exhaustive unit test suite covering edge cases'],
    },
    skillAssessment: {
      title: 'Data Structures, Algorithms & Software Architecture Standardized Examination',
      description: 'Evaluates Big-O complexity, tree/graph algorithms, dynamic programming, and SOLID design patterns.',
      recommendedAssessmentId: 'swe-core-01',
    },
  },

  // 8. UI/UX DESIGNER
  {
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    description: 'Master human-centered digital product design. Conduct user research, construct wireframes, master Figma design systems, conduct usability tests, and build accessible, responsive user interfaces.',
    category: 'Design & Product',
    icon: 'Figma',
    estimatedDuration: '4 - 6 Months',
    status: 'published',
    requiredSkills: ['Design Thinking & User Research', 'Figma Mastery & Auto-Layout', 'Design Systems & Tokens', 'Information Architecture & Wireframing', 'WCAG Accessibility Standards', 'Interactive Prototyping & Usability Testing'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: UX Principles & Wireframing',
        description: 'User personas, user journey mapping, information architecture, low-fidelity wireframing, and usability heuristics.',
        modules: [
          {
            moduleId: 'ux-m1-principles',
            title: 'Design Thinking & Nielsen Norman Usability Heuristics',
            description: 'The 10 Usability Heuristics, user research interviews, empathy maps, and low-fidelity sketching.',
            estimatedHours: 25,
            topics: [
              {
                topicId: 'ux-t1-heuristics',
                title: 'Jakob Nielsen 10 Usability Heuristics for User Interface Design',
                summary: 'Evaluate digital products against proven usability heuristics to identify UX friction points.',
                estimatedMinutes: 45,
                studyMaterial: {
                  introduction: 'Jakob Nielsen 10 Usability Heuristics are the industry standard rules of thumb for interaction design. Evaluating interfaces against these heuristics uncovers 85% of core usability flaws before writing code.',
                  keyConcepts: ['Visibility of System Status', 'Match between System and Real World', 'User Control and Freedom (Undo/Redo)', 'Consistency and Standards', 'Error Prevention and Clear Recovery'],
                  detailedNotes: `Core Heuristics Applied:
1. Visibility of System Status: Users should always be informed of what is going on through appropriate feedback (e.g., upload progress bars, live status telemetry indicators).
2. User Control and Freedom: Provide a clearly marked "emergency exit" (e.g., cancel button on assessment launch modal, undo actions).
3. Error Prevention: Better than good error messages is careful design that prevents problems from occurring (e.g., pre-check camera permissions BEFORE starting a timer).`,
                  codeSnippet: {
                    language: 'markdown',
                    code: `<!-- Heuristic Audit Checklist Template -->
| Heuristic | Status | Observation | Severity (1-4) | Recommendation |
|---|---|---|---|---|
| Visibility of Status | Pass | Live webcam feed shows "Camera Ready" indicator | 1 | Maintain visual status dot |
| Error Prevention | Fail | Start Assessment button starts timer without camera check | 4 | Add modal pre-flight check |
| Recognition > Recall | Pass | Candidate sees target skills tagged as badges | 1 | Retain badge layout |`,
                    explanation: 'Usability audit templates standardize design reviews across engineering and product teams.',
                  },
                  practicalExamples: ['Error Prevention: Disable destructive "Delete Account" buttons until the user types their username to confirm.'],
                  stepByStep: ['Step 1: Walk through core user journeys (e.g., Registration to Exam Completion).', 'Step 2: Score each screen against the 10 heuristics.', 'Step 3: Document actionable design improvements in Figma.'],
                  practiceExercises: [
                    {
                      id: 'ex-heuristic-audit',
                      question: 'Identify which Nielsen Heuristic is violated when an e-commerce checkout form wipes all input fields after a single invalid credit card error.',
                      initialCode: `Heuristic violated: ...`,
                      solution: `Heuristic: Error Prevention & Help Users Recognize, Diagnose, and Recover from Errors. The form should preserve valid inputs and highlight strictly the invalid card field.`,
                      hints: ['Users must not be forced to re-enter valid data'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between Low-Fidelity and High-Fidelity prototyping?',
                      answer: 'Low-Fidelity prototypes (wireframes, sketches) focus on information architecture, workflow navigation, and content hierarchy without visual styling distractions. High-Fidelity prototypes incorporate brand typography, exact color tokens, micro-interactions, and realistic data to evaluate visual polish and real-world usability.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Nielsen Heuristics guide intuitive interaction design and prevent costly UX redesigns late in development.',
                },
                freeCourses: [
                  {
                    title: 'Nielsen Norman Group UX Research & Heuristics Articles',
                    provider: 'NN/g Usability',
                    url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
                    skillCovered: 'Usability Heuristics, User Experience Audits',
                    level: 'Beginner',
                    duration: '15 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Figma Mastery & Design System Architecture',
        description: 'Auto-Layout, components, variants, design tokens (colors, typography, spacing), and accessible responsive design.',
        modules: [
          {
            moduleId: 'ux-m2-figma-systems',
            title: 'Figma Auto-Layout, Component Variants & Design Tokens',
            description: 'Advanced Auto-Layout v5, component properties, token naming conventions, and WCAG AA contrast verification.',
            estimatedHours: 35,
            topics: [
              {
                topicId: 'ux-t2-figma-tokens',
                title: 'Design System Architecture: Tokens, Components & Auto-Layout',
                summary: 'Architect scalable design systems in Figma using semantic tokens and Auto-Layout components.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'A design system is a comprehensive collection of reusable components guided by clear standards. Design tokens represent atomic values (colors, spacing, typography) that bridge design and frontend implementation.',
                  keyConcepts: ['Design Tokens: Global vs Semantic vs Component tokens', 'Figma Auto-Layout (Flexbox equivalent in design)', 'Component Variants & Boolean Properties', 'WCAG AA Color Contrast ratios (4.5:1 minimum for normal text)'],
                  detailedNotes: `Design Token Structure:
- Global Token: color.charcoal.900 = #252525
- Semantic Token: color.surface.primary = {color.charcoal.900}
- Component Token: card.background = {color.surface.primary}

Why This Matters:
When rebranding or adjusting palettes, modifying the semantic token automatically updates thousands of components across both Figma and CSS custom properties without manual search-and-replace.`,
                  codeSnippet: {
                    language: 'css',
                    code: `/* Figma Design Tokens Transformed to CSS Custom Properties */
:root {
  /* Brand Core Tokens */
  --color-charcoal: #252525;
  --color-warm-ivory: #F5F1E9;
  --color-terracotta: #C46A45;
  --color-muted-gold: #B89B6A;

  /* Semantic UI Tokens */
  --bg-main: var(--color-warm-ivory);
  --bg-surface: #FFFFFF;
  --text-primary: var(--color-charcoal);
  --border-light: #E8E1D7;

  /* Spacing Scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
}`,
                    explanation: 'Semantic tokens match Figma design variables 1:1, ensuring seamless design-to-code alignment.',
                  },
                  practicalExamples: ['Color Contrast: Normal text requires minimum 4.5:1 contrast against its background; large text (18pt+) requires 3:1.'],
                  stepByStep: ['Step 1: Define global color palette in Figma styles.', 'Step 2: Create semantic layer tokens (surface, text, border, brand).', 'Step 3: Construct Auto-Layout button and input components with variants.'],
                  practiceExercises: [
                    {
                      id: 'ex-contrast-check',
                      question: 'Verify if text color #77736D on a #FFFFFF background passes WCAG 2.1 AA standards for normal text (minimum 4.5:1).',
                      initialCode: `Contrast Ratio: ...\nResult: Pass / Fail`,
                      solution: `Contrast Ratio is approximately 4.7:1. Result: PASS (exceeds the 4.5:1 requirement).`,
                      hints: ['Calculate relative luminance or check using WebAIM contrast checker'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What are Design Tokens and why are they critical in enterprise digital product teams?',
                      answer: 'Design tokens are platform-agnostic key-value pairs that store visual design attributes (colors, typography, spacing). They act as a single source of truth shared between designers in Figma and engineers in code (CSS, iOS, Android), eliminating visual discrepancies during handoff.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Design systems and tokens bridge the gap between creative visual design and scalable frontend code.',
                },
                freeCourses: [
                  {
                    title: 'Figma for Beginners & Auto Layout Masterclass',
                    provider: 'Figma Community & YouTube',
                    url: 'https://help.figma.com/hc/en-us/categories/360002042553-Figma-design',
                    skillCovered: 'Figma Auto-Layout, Components, Variants',
                    level: 'Intermediate',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Usability Testing, Micro-interactions & Design Handoff',
        description: 'Usability testing protocols, interactive prototypes, micro-interaction animations, and production design-to-code handoff.',
        modules: [
          {
            moduleId: 'ux-m3-testing-handoff',
            title: 'Usability Testing & Design Handoff Protocols',
            description: 'Moderated/unmoderated testing, SUS scoring, developer documentation, and micro-interactions.',
            estimatedHours: 35,
            topics: [
              {
                topicId: 'ux-t3-sus-testing',
                title: 'System Usability Scale (SUS) Testing & Developer Handoff',
                summary: 'Measure product usability with SUS benchmarking and create frictionless developer handoff documentation.',
                estimatedMinutes: 50,
                studyMaterial: {
                  introduction: 'The System Usability Scale (SUS) is a 10-item questionnaire giving an overview of user-perceived usability. An average score is 68; top products score 80+.',
                  keyConcepts: ['System Usability Scale (SUS) scoring methodology', 'Think-aloud testing protocol', 'Edge case states (Empty, Loading, Error, Partial data)', 'Design specification handoff'],
                  detailedNotes: `Comprehensive State Handoff:
Never hand off only the "ideal" screen. Always provide:
1. Blank/Empty state: When a student has 0 uploaded certificates.
2. Loading state: Skeleton animation while telemetry is synchronizing.
3. Partial/Degraded state: When webcam access is blocked or network drops.
4. Error state: When validation fails or server encounters an exception.`,
                  codeSnippet: {
                    language: 'markdown',
                    code: `<!-- State Specification for Developer Handoff -->
## Component: Candidate Telemetry Badge
- **Default State**: Background #FAF6EF, Border #E8E1D7, Text #252525.
- **Hover State**: Elevate shadow to var(--shadow-sm), Border #C46A45.
- **Loading State**: Shimmer skeleton animation 1.5s loop.
- **Zero-Data State**: Icon AlertOctagon, Text "No Evidence Submitted".`,
                    explanation: 'Documenting all states prevents engineers from guessing UI behavior during edge cases.',
                  },
                  practicalExamples: ['Empty states: Always include an actionable call-to-action button (e.g., "Submit Your First Certificate").'],
                  stepByStep: ['Step 1: Write usability test tasks.', 'Step 2: Observe 5 representative users without prompting.', 'Step 3: Document state variations and provide redline specifications to engineers.'],
                  practiceExercises: [
                    {
                      id: 'ex-empty-state',
                      question: 'Design the content copy for an empty state on a student Job Matches page who has not taken any assessments yet.',
                      initialCode: `Headline: ...\nBody: ...\nCTA Button: ...`,
                      solution: `Headline: "No Job Matches Yet"\nBody: "Complete a proctored technical assessment to unlock AI-verified job recommendations tailored to your skills."\nCTA Button: "Explore Available Assessments"`,
                      hints: ['Explain why it is empty', 'Provide clear guidance on next steps'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'How do you conduct an unmoderated usability test?',
                      answer: 'In an unmoderated test, participants complete pre-defined tasks on a digital prototype independently without a facilitator present, using screen recording and think-aloud software. It allows rapid data collection from diverse user demographics at low cost.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Thorough state documentation and usability testing ensure designs hold up under real-world usage.',
                },
                freeCourses: [
                  {
                    title: 'W3C Web Accessibility Initiative (WAI) Curriculum',
                    provider: 'W3C WAI',
                    url: 'https://www.w3.org/WAI/fundamentals/',
                    skillCovered: 'Accessibility, WCAG AA, Screen Readers',
                    level: 'Advanced',
                    duration: '15 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'End-to-End SaaS Web & Mobile Design System in Figma',
      description: 'Design a complete enterprise proctoring and assessment platform in Figma featuring comprehensive design tokens, responsive auto-layout components, WCAG AA compliance, and interactive prototypes.',
      requirements: ['Interactive prototype with hover/active states', 'Figma Design System with semantic tokens', 'Empty, Loading, Error, and Success states for all flows', 'SUS usability test report from 5 candidate sessions'],
    },
    skillAssessment: {
      title: 'UI/UX Design Systems & Usability Standardized Examination',
      description: 'Evaluates usability heuristics, Figma design systems, accessibility guidelines, and interaction design.',
      recommendedAssessmentId: 'uiux-design-01',
    },
  },

  // 9. CLOUD ENGINEER
  {
    slug: 'cloud-engineer',
    title: 'Cloud Engineer',
    description: 'Architect, automate, and secure enterprise infrastructure on public clouds (AWS/Azure). Master Infrastructure as Code (Terraform), Containerization (Docker, Kubernetes), Serverless, and automated CI/CD pipelines.',
    category: 'Cloud & DevOps',
    icon: 'Cloud',
    estimatedDuration: '6 - 8 Months',
    status: 'published',
    requiredSkills: ['AWS/Azure Core Services', 'Linux System Administration', 'Docker & Kubernetes', 'Terraform (IaC)', 'CI/CD Pipelines (GitHub Actions)', 'Cloud Security (IAM, VPC)', 'Monitoring (Prometheus/Grafana)'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: Linux Administration & Cloud Fundamentals',
        description: 'Linux shell scripting, permissions, networking (TCP/IP, DNS, Subnets), and core cloud primitives (Compute, Storage, Identity).',
        modules: [
          {
            moduleId: 'cld-m1-linux-aws',
            title: 'Linux Systems & AWS Core Architecture (EC2, S3, IAM)',
            description: 'SSH key management, systemd, bash automation, AWS IAM least privilege, and S3 storage classes.',
            estimatedHours: 35,
            topics: [
              {
                topicId: 'cld-t1-iam-vpc',
                title: 'AWS Identity and Access Management (IAM) & VPC Networking',
                summary: 'Implement principle of least privilege, IAM roles, policies, VPC subnets, and Security Groups.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Cloud security begins with Identity and Access Management (IAM) and network isolation via Virtual Private Clouds (VPCs). Proper IAM configuration ensures microservices and developers have only the minimum permissions necessary.',
                  keyConcepts: ['Principle of Least Privilege', 'IAM Users vs Roles vs Policies', 'VPC Public vs Private Subnets', 'Internet Gateways and NAT Gateways', 'Security Groups (Stateful) vs Network ACLs (Stateless)'],
                  detailedNotes: `Security Groups vs Network ACLs:
- Security Group: Operates at the virtual network interface (ENI) level. Stateful: Return traffic is automatically allowed regardless of inbound rules.
- Network ACL: Operates at the subnet boundary level. Stateless: Inbound and outbound rules must both be explicitly allowed.

IAM Role Best Practice:
Never hardcode AWS Access Keys in application source code. Attach IAM Roles directly to EC2 instances, ECS tasks, or Lambda functions; AWS automatically rotates temporary credentials via the instance metadata service.`,
                  codeSnippet: {
                    language: 'json',
                    code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3CertificateBucketReadWrite",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::skillproof-certificates-prod/*"
    }
  ]
}`,
                    explanation: 'The IAM policy enforces least privilege by granting read/write strictly to a single target S3 bucket.',
                  },
                  practicalExamples: ['Database Isolation: Always place database instances in Private Subnets with no public IP address.'],
                  stepByStep: ['Step 1: Design a VPC with two public and two private subnets across multiple Availability Zones.', 'Step 2: Configure Route Tables and NAT Gateways.', 'Step 3: Define strict IAM roles for application execution.'],
                  practiceExercises: [
                    {
                      id: 'ex-iam-policy',
                      question: 'Write an IAM policy statement allowing a service to read objects from s3:::my-bucket-name/public/* only.',
                      initialCode: `{\n  "Effect": "...",\n  "Action": ...\n}`,
                      solution: `{\n  "Effect": "Allow",\n  "Action": ["s3:GetObject"],\n  "Resource": "arn:aws:s3:::my-bucket-name/public/*"\n}`,
                      hints: ['Action is s3:GetObject', 'Resource format is arn:aws:s3:::bucket-name/path/*'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'Why should backend databases always be placed in a private subnet?',
                      answer: 'Placing databases in a private subnet ensures they do not have public IP addresses and cannot be reached directly from the public internet. Only services located inside the authorized VPC (such as application servers in public subnets or via internal load balancers) can establish connections.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'IAM least privilege and VPC network segmentation form the core of modern cloud security.',
                },
                freeCourses: [
                  {
                    title: 'AWS Skill Builder: Cloud Practitioner Essentials',
                    provider: 'AWS Skill Builder',
                    url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
                    skillCovered: 'EC2, S3, IAM, VPC, Cloud Architecture',
                    level: 'Beginner',
                    duration: '6 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Docker Containers & Infrastructure as Code (Terraform)',
        description: 'Multi-stage Docker builds, container orchestration, and automated declarative provisioning with Terraform.',
        modules: [
          {
            moduleId: 'cld-m2-docker-terraform',
            title: 'Docker Multi-Stage Builds & Terraform (IaC)',
            description: 'Docker image optimization, docker-compose, Terraform HCL, state management, and modular infrastructure.',
            estimatedHours: 40,
            topics: [
              {
                topicId: 'cld-t2-terraform-hcl',
                title: 'Infrastructure as Code (IaC) with Terraform & Multi-Stage Docker',
                summary: 'Provision cloud resources declaratively with Terraform and build lightweight production Docker images.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Infrastructure as Code (IaC) manages cloud resources using declarative code files rather than manual console clicking. Terraform allows infrastructure to be version-controlled, tested, and reliably reproduced.',
                  keyConcepts: ['Declarative Configuration (HCL)', 'Terraform State file and Remote S3 Locking', 'terraform plan vs terraform apply', 'Docker Multi-stage builds for small image size'],
                  detailedNotes: `Multi-stage Docker Build Benefits:
Building an application (e.g., compiling TypeScript or bundling React) requires heavy tooling (compilers, devDependencies).
Multi-stage builds use an initial build stage to compile assets, and copy ONLY the compiled production artifacts into a tiny runtime base (e.g., alpine or distroless), shrinking images from 1.2GB down to 50MB.`,
                  codeSnippet: {
                    language: 'dockerfile',
                    code: `# Multi-Stage Production Dockerfile for Node.js
# Stage 1: Build & Compile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 5000
CMD ["node", "dist/server.js"]`,
                    explanation: 'The runner stage excludes build dependencies, drastically reducing vulnerabilities and image footprint.',
                  },
                  practicalExamples: ['Always run containers with USER node instead of root to prevent host privilege escalation.'],
                  stepByStep: ['Step 1: Write multi-stage Dockerfile.', 'Step 2: Write Terraform configuration (.tf) declaring compute and database resources.', 'Step 3: Run terraform plan to preview infrastructure changes before applying.'],
                  practiceExercises: [
                    {
                      id: 'ex-terraform-s3',
                      question: 'Write a basic Terraform resource block defining an AWS S3 bucket named skillproof-vault with private ACL.',
                      initialCode: `resource "aws_s3_bucket" "vault" {\n  // define bucket\n}`,
                      solution: `resource "aws_s3_bucket" "vault" {\n  bucket = "skillproof-vault"\n}\n\nresource "aws_s3_bucket_ownership_controls" "vault" {\n  bucket = aws_s3_bucket.vault.id\n  rule {\n    object_ownership = "BucketOwnerEnforced"\n  }\n}`,
                      hints: ['resource "aws_s3_bucket" "vault"', 'Set bucket attribute'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'Why is the Terraform state file sensitive and how should it be stored in production?',
                      answer: 'The Terraform state file (terraform.tfstate) maps real-world cloud resources to your configuration and may contain sensitive plaintext values (database passwords, tokens). In production, it must be stored in a remote backend like an encrypted AWS S3 bucket with strict IAM access and DynamoDB state locking to prevent concurrent write collisions.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Terraform and Docker turn infrastructure and deployments into reproducible, version-controlled artifacts.',
                },
                freeCourses: [
                  {
                    title: 'Terraform Associate Certification Learning Path',
                    provider: 'HashiCorp Learn',
                    url: 'https://developer.hashicorp.com/terraform/tutorials',
                    skillCovered: 'Terraform CLI, HCL, State, Modules, Providers',
                    level: 'Intermediate',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Kubernetes (K8s) & Enterprise CI/CD Automation',
        description: 'Kubernetes Pods, Deployments, Services, Ingress, Horizontal Pod Autoscaling (HPA), and GitHub Actions CI/CD.',
        modules: [
          {
            moduleId: 'cld-m3-k8s-cicd',
            title: 'Kubernetes Orchestration & Automated CI/CD Pipelines',
            description: 'Deployments, rolling updates, health probes, Helm charts, and automated deployment pipelines.',
            estimatedHours: 50,
            topics: [
              {
                topicId: 'cld-t3-k8s-deployments',
                title: 'Kubernetes Architecture: Deployments, Services & Self-Healing',
                summary: 'Manage containerized microservices at scale using Kubernetes declarative manifests, rolling updates, and liveness/readiness probes.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Kubernetes (K8s) is an open-source container orchestration system for automating application deployment, scaling, and management across clusters of host machines.',
                  keyConcepts: ['Control Plane (API Server, etcd, Scheduler) vs Worker Nodes (kubelet, kube-proxy)', 'Pods, Deployments, and ReplicaSets', 'Services (ClusterIP, NodePort, LoadBalancer)', 'Liveness vs Readiness Health Probes', 'Zero-downtime Rolling Updates'],
                  detailedNotes: `Health Probes in Kubernetes:
- Liveness Probe: Checks if the container is still running. If it fails, Kubernetes restarts the container.
- Readiness Probe: Checks if the container is ready to accept incoming network traffic. If it fails, Kubernetes removes the pod from the Service load balancer endpoints.
- Rolling Update Strategy: Ensures new versions replace older pods incrementally, guaranteeing zero dropped connections during deployments.`,
                  codeSnippet: {
                    language: 'yaml',
                    code: `# Kubernetes Production Deployment Manifest
apiVersion: apps/v1
kind: Deployment
metadata:
  name: assessment-service
  labels:
    app: assessment-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: assessment-service
  template:
    metadata:
      labels:
        app: assessment-service
    spec:
      containers:
      - name: api
        image: ghcr.io/skillproof/assessment-service:v1.2.0
        ports:
        - containerPort: 5000
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 5000
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"`,
                    explanation: 'maxUnavailable: 0 guarantees that no existing pods are taken down until new pods have passed their readiness probe.',
                  },
                  practicalExamples: ['Resource Limits: Always define CPU/memory limits to prevent a single buggy container from consuming all node resources.'],
                  stepByStep: ['Step 1: Containerize application into a lightweight image.', 'Step 2: Write Kubernetes Deployment and Service manifests.', 'Step 3: Deploy to cluster using kubectl apply -f deployment.yaml.'],
                  practiceExercises: [
                    {
                      id: 'ex-k8s-service',
                      question: 'Write a Kubernetes ClusterIP Service manifest routing traffic on port 80 to backend pods on containerPort 5000.',
                      initialCode: `apiVersion: v1\nkind: Service\n...`,
                      solution: `apiVersion: v1\nkind: Service\nmetadata:\n  name: api-service\nspec:\n  type: ClusterIP\n  selector:\n    app: assessment-service\n  ports:\n  - port: 80\n    targetPort: 5000`,
                      hints: ['type: ClusterIP', 'selector matches app label', 'port: 80, targetPort: 5000'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the practical difference between a Liveness Probe and a Readiness Probe in Kubernetes?',
                      answer: 'A Liveness probe detects when an application is stuck or deadlocked and restarts the container. A Readiness probe determines whether the container is ready to receive network traffic; if it fails, traffic is temporarily diverted without terminating or restarting the container.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Kubernetes declarative manifests and health probes ensure self-healing and zero-downtime microservice operations.',
                },
                freeCourses: [
                  {
                    title: 'Introduction to Kubernetes (LFS158x)',
                    provider: 'Linux Foundation / edX',
                    url: 'https://www.edx.org/learn/kubernetes/the-linux-foundation-introduction-to-kubernetes',
                    skillCovered: 'Kubernetes Architecture, Pods, Deployments, Services',
                    level: 'Advanced',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'Automated Multi-Environment Cloud Infrastructure with Terraform & Kubernetes',
      description: 'Provision an automated AWS VPC, managed Kubernetes cluster (EKS), and deploy containerized microservices using GitHub Actions CI/CD with Prometheus telemetry.',
      requirements: ['Terraform IaC with remote S3 state backend', 'Multi-stage Docker builds', 'Kubernetes manifests with HPA and zero-downtime rolling updates', 'Automated GitHub Actions CI/CD pipeline'],
    },
    skillAssessment: {
      title: 'Cloud Infrastructure, Containers & DevOps Standardized Examination',
      description: 'Evaluates AWS VPC networking, Docker containerization, Kubernetes orchestration, and Terraform IaC.',
      recommendedAssessmentId: 'cloud-devops-01',
    },
  },

  // 10. CYBERSECURITY ENGINEER
  {
    slug: 'cybersecurity-engineer',
    title: 'Cybersecurity Engineer',
    description: 'Protect enterprise infrastructure, networks, and applications. Master security fundamentals, network defense, Linux security, ethical hacking, OWASP Top 10 vulnerabilities, cryptography, and SIEM threat monitoring.',
    category: 'Security & Operations',
    icon: 'Shield',
    estimatedDuration: '6 - 9 Months',
    status: 'published',
    requiredSkills: ['Network Security & Protocols (Wireshark)', 'Linux Hardening & Bash', 'OWASP Top 10 Web Security', 'Penetration Testing (Metasploit, Nmap)', 'Cryptography (PKI, AES, RSA)', 'SIEM & Threat Detection (Splunk/ELK)', 'Identity & Access Security'],
    levels: [
      {
        level: 'beginner',
        title: 'Beginner: Security Foundations & Network Defense',
        description: 'CIA Triad, OSI model security, network traffic analysis with Wireshark, port scanning with Nmap, and Linux security.',
        modules: [
          {
            moduleId: 'sec-m1-network-foundations',
            title: 'Networking Protocols, Wireshark & Port Scanning',
            description: 'TCP 3-way handshake, DNS, ARP poisoning, TLS handshake, and Nmap vulnerability enumeration.',
            estimatedHours: 35,
            topics: [
              {
                topicId: 'sec-t1-tcp-nmap',
                title: 'TCP/IP Handshake Analysis, Wireshark & Nmap Enumeration',
                summary: 'Analyze network packet flows, inspect TCP SYN-ACK flags, and safely enumerate open service ports.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Cybersecurity starts at the network layer. Understanding how packets traverse networks via TCP/IP and how attackers scan exposed ports is fundamental to defending infrastructure.',
                  keyConcepts: ['The CIA Triad (Confidentiality, Integrity, Availability)', 'TCP 3-Way Handshake (SYN, SYN-ACK, ACK)', 'Nmap scanning types: SYN scan (-sS) vs Full Connect (-sT)', 'Packet inspection with Wireshark filters'],
                  detailedNotes: `TCP Handshake Mechanics:
1. Client sends SYN packet with an Initial Sequence Number (ISN).
2. Server responds with SYN-ACK packet, acknowledging client ISN and sending its own.
3. Client sends ACK packet back. The connection is established.

Nmap Stealth SYN Scan (-sS):
A SYN scan sends SYN packets to target ports. If a SYN-ACK returns, the port is OPEN. Nmap immediately sends an RST (reset) packet instead of completing the handshake, avoiding full TCP connection logs on legacy servers.`,
                  codeSnippet: {
                    language: 'bash',
                    code: `# Safe Diagnostic Network Enumeration Commands
# Perform stealth SYN scan with OS detection and service version detection
nmap -sS -sV -O 192.168.1.100

# Wireshark Display Filter to isolate suspicious TCP SYN packets
tcp.flags.syn == 1 and tcp.flags.ack == 0

# Scan specific ports for vulnerable web endpoints
nmap -p 80,443,8080 -sC 192.168.1.100`,
                    explanation: 'The -sV flag probes open ports to determine service and version details to identify known CVE vulnerabilities.',
                  },
                  practicalExamples: ['Firewall inspection: Inspecting packet flags reveals port scanning sweeps attempting to map network topology.'],
                  stepByStep: ['Step 1: Capture traffic using Wireshark on a virtualized lab interface.', 'Step 2: Filter for handshake anomalies or plaintext credentials.', 'Step 3: Run targeted Nmap scans against authorization-approved lab targets.'],
                  practiceExercises: [
                    {
                      id: 'ex-nmap-cmd',
                      question: 'Write an Nmap command to scan ports 1 through 1000 on host 10.0.0.5 without performing host ping discovery.',
                      initialCode: `nmap ... 10.0.0.5`,
                      solution: `nmap -Pn -p 1-1000 10.0.0.5`,
                      hints: ['Use -Pn to disable ping', 'Use -p 1-1000 for port range'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between a SYN scan and a Full TCP Connect scan in Nmap?',
                      answer: 'A Full Connect scan (-sT) completes the entire 3-way TCP handshake (SYN, SYN-ACK, ACK), which is logged by almost all modern firewalls and application servers. A SYN stealth scan (-sS) sends an RST packet immediately after receiving SYN-ACK, tearing down the connection before it is completed and logged.',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Packet-level network analysis is essential for identifying active reconnaissance and intrusion attempts.',
                },
                freeCourses: [
                  {
                    title: 'Network Security Fundamentals & Wireshark Labs',
                    provider: 'Microsoft Learn',
                    url: 'https://learn.microsoft.com/en-us/training/modules/describe-basic-security-concepts/',
                    skillCovered: 'CIA Triad, Network Security, Defense in Depth',
                    level: 'Beginner',
                    duration: '10 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'intermediate',
        title: 'Intermediate: Application Security & OWASP Top 10',
        description: 'Web application penetration testing, SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, IDOR, and secure code audits.',
        modules: [
          {
            moduleId: 'sec-m2-owasp',
            title: 'OWASP Top 10 Web Vulnerabilities & Secure Code Defense',
            description: 'SQL Injection, XSS, Insecure Direct Object References (IDOR), SSRF, and authentication bypasses.',
            estimatedHours: 45,
            topics: [
              {
                topicId: 'sec-t2-sqli-xss',
                title: 'SQL Injection (SQLi) & Cross-Site Scripting (XSS) Remediation',
                summary: 'Exploit and definitively remediate SQL Injection, Reflected/Stored XSS, and broken access controls.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'The OWASP Top 10 is the universally recognized awareness document for web application security vulnerabilities. Injection and broken access controls consistently rank as the most severe risks.',
                  keyConcepts: ['SQL Injection: Classic, Blind, Error-based', 'Prepared Statements & Parameterized Queries', 'Stored vs Reflected vs DOM-based XSS', 'Content Security Policy (CSP) and Output Encoding', 'Insecure Direct Object References (IDOR)'],
                  detailedNotes: `Remediating SQL Injection:
Vulnerable code concatenates raw user input into an SQL query string:
"SELECT * FROM users WHERE email = '" + req.body.email + "'"
An attacker inputs: admin@test.com' OR '1'='1
Definitive Fix: Always use parameterized queries (prepared statements). Parameterized values are treated strictly as data literals, never executable SQL commands.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// SECURE: Parameterized Query Defense against SQL Injection
const pool = require('./db');

async function getCandidateByEmail(email) {
  // Query parameters ($1) are sent separately from the SQL statement
  const query = 'SELECT id, email, role FROM users WHERE email = $1 AND status = $2';
  const values = [email, 'active'];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

// SECURE: Content Security Policy (CSP) Headers in Express
const helmet = require('helmet');
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://assets.skillproof.ai"]
    }
  })
);`,
                    explanation: 'Prepared statements eliminate SQL Injection. Content Security Policy restricts where scripts can execute from, mitigating XSS attacks.',
                  },
                  practicalExamples: ['IDOR Defense: Never trust client-supplied userId from query params; always verify ownership against req.user.id from the verified JWT.'],
                  stepByStep: ['Step 1: Replace raw SQL string concatenation with prepared statements.', 'Step 2: Sanitize all untrusted inputs before storage.', 'Step 3: Enforce strict Content Security Policy (CSP) headers.'],
                  practiceExercises: [
                    {
                      id: 'ex-idor-fix',
                      question: 'Fix an IDOR vulnerability in an Express route: router.get("/documents/:docId", (req, res) => Document.findById(req.params.docId)).',
                      initialCode: `router.get("/documents/:docId", async (req, res) => {\n  const doc = await Document.findById(req.params.docId);\n  res.json(doc);\n});`,
                      solution: `router.get("/documents/:docId", async (req, res) => {\n  const doc = await Document.findOne({ _id: req.params.docId, ownerId: req.user.id });\n  if (!doc) return res.status(404).json({ message: "Document not found or access denied" });\n  res.json(doc);\n});`,
                      hints: ['Check that ownerId matches authenticated req.user.id', 'Return 404 to avoid leaking document existence'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between Stored XSS and Reflected XSS?',
                      answer: 'Stored (Persistent) XSS occurs when malicious script input is permanently saved in the database (e.g., in a comment or profile field) and executed whenever other users view that data. Reflected XSS occurs when an immediate request parameter (such as a search query) is reflected back into the response page without proper sanitization, requiring social engineering to trick the victim into clicking a crafted link.',
                      difficulty: 'Intermediate',
                    },
                  ],
                  summaryNotes: 'Parameterized queries and contextual output encoding definitively neutralize injection vulnerabilities.',
                },
                freeCourses: [
                  {
                    title: 'OWASP Top 10 Web Application Security Standards',
                    provider: 'OWASP Foundation',
                    url: 'https://owasp.org/www-project-top-ten/',
                    skillCovered: 'SQLi, XSS, Broken Access Control, Cryptographic Failures',
                    level: 'Intermediate',
                    duration: '20 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        level: 'advanced',
        title: 'Advanced: Cryptography, SIEM & Incident Response',
        description: 'Public Key Infrastructure (PKI), asymmetric encryption, SIEM log analysis, intrusion detection, and incident response.',
        modules: [
          {
            moduleId: 'sec-m3-crypto-siem',
            title: 'Modern Cryptography, SIEM Monitoring & Threat Hunting',
            description: 'AES-256, RSA, TLS 1.3, hashing algorithms (bcrypt/argon2), and log analysis with Splunk/Elasticsearch.',
            estimatedHours: 45,
            topics: [
              {
                topicId: 'sec-t3-crypto-hashing',
                title: 'Cryptographic Hashing, Salted Password Derivation & PKI',
                summary: 'Understand cryptographic hashing vs encryption, password stretching with bcrypt/Argon2, and digital signatures.',
                estimatedMinutes: 60,
                studyMaterial: {
                  introduction: 'Cryptography provides the mathematical foundation for digital trust. Modern security requires understanding the distinction between reversible encryption, non-reversible cryptographic hashes, and salted password derivation functions.',
                  keyConcepts: ['Hashing vs Symmetric Encryption (AES) vs Asymmetric Encryption (RSA/ECC)', 'Why MD5 and SHA-1 are cryptographically broken', 'Salted Key Derivation: bcrypt, Argon2, PBKDF2', 'Digital Signatures and Public Key Infrastructure (PKI)'],
                  detailedNotes: `Password Storage Best Practices:
Never use fast hashing algorithms (MD5, SHA-256) for password storage. Modern GPUs can compute billions of SHA-256 hashes per second, making brute-force dictionary attacks trivial.
Always use memory-hard, computationally intensive adaptive hashing algorithms:
- bcrypt: Incorporates a per-password random salt and configurable work factor (cost).
- Argon2id: Winner of the Password Hashing Competition; resistant to GPU and ASIC hardware attacks.`,
                  codeSnippet: {
                    language: 'javascript',
                    code: `// Secure Password Hashing with Bcrypt
const bcrypt = require('bcryptjs');

// 1. Hash password with automatic salt generation (cost factor = 12)
async function secureHashPassword(plaintextPassword) {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
  return hashedPassword;
}

// 2. Safe Timing-Attack Resistant Verification
async function verifyCandidatePassword(plaintextPassword, storedHash) {
  // bcrypt.compare is timing-attack resistant
  const isMatch = await bcrypt.compare(plaintextPassword, storedHash);
  return isMatch;
}`,
                    explanation: 'bcrypt.compare executes in constant time relative to hash length, preventing timing side-channel attacks.',
                  },
                  practicalExamples: ['JWT Verification: Always specify allowed algorithms explicitly (e.g., algorithms: ["HS256"]) to prevent algorithm confusion attacks.'],
                  stepByStep: ['Step 1: Replace legacy SHA/MD5 hashing with bcrypt or Argon2.', 'Step 2: Select a work factor tuned to ~250ms computation time on target hardware.', 'Step 3: Enforce strict TLS 1.3 on all client-server transit.'],
                  practiceExercises: [
                    {
                      id: 'ex-bcrypt-verify',
                      question: 'Explain why adding a unique cryptographic salt prevents Rainbow Table attacks.',
                      initialCode: `Explanation: ...`,
                      solution: `Rainbow tables are precomputed lookup tables of hashes for common passwords. A unique random salt appended to each password changes the resulting hash entirely, forcing attackers to compute brute-force hashes individually for each user rather than using a single shared lookup table.`,
                      hints: ['Mention precomputed lookup tables', 'Explain how salt forces individual calculation'],
                    },
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between Symmetric and Asymmetric encryption?',
                      answer: 'Symmetric encryption (e.g., AES-256) uses the exact same secret key for both encryption and decryption. Asymmetric encryption (e.g., RSA, ECC) uses a mathematically linked keypair: a Public Key (used to encrypt or verify signatures) and a Private Key (kept secret, used to decrypt or create signatures).',
                      difficulty: 'Junior',
                    },
                  ],
                  summaryNotes: 'Adaptive salted hashing and proper cryptographic key management are non-negotiable requirements for credential security.',
                },
                freeCourses: [
                  {
                    title: 'Cryptography I by Stanford University',
                    provider: 'Stanford Online / Coursera Free Audit',
                    url: 'https://www.coursera.org/learn/crypto',
                    skillCovered: 'Block Ciphers, Hash Functions, Public Key Encryption',
                    level: 'Advanced',
                    duration: '40 Hours',
                    isFree: true,
                    hasCertificate: false,
                    status: 'active',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    finalProject: {
      title: 'Enterprise Vulnerability Assessment, Pen-Test Audit & Security Hardening',
      description: 'Conduct a comprehensive vulnerability audit on a simulated multi-tier web application, identifying OWASP Top 10 vulnerabilities, remediating code flaws, and configuring a SIEM monitoring dashboard.',
      requirements: ['Vulnerability assessment report detailing discovered flaws', 'Definitive code patches neutralizing SQLi and XSS', 'Hardened Linux firewall and Content Security Policy configuration', 'Configured centralized log audit trail'],
    },
    skillAssessment: {
      title: 'Application Security & Network Defense Standardized Examination',
      description: 'Evaluates OWASP Top 10 remediation, cryptographic implementations, network packet analysis, and security auditing.',
      recommendedAssessmentId: 'cybersecurity-01',
    },
  },
];

module.exports = roadmapsData;
