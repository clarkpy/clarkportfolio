# clarkportfolio

## Another portfolio??

> How'd you guess?? This is my 3rd portfolio but I need one for getting into the job market soon 😭. I made this one more generic that some of my others while making it match some of the other open source projects I am creating at the moment such as [ClarkLab](https://github.com/clarkpy/clarklab-global) which also has a purple on black sort of theme.

## Development Process

> I took inspiration from [Aiden](https://aiden.gg), an online-space developer. I have been a fan of his portfolio site for years but obviously i don't want to copy his style so in my girlfriend's words, I magpied some of his ideas such as his "marquee carousel" for showing his tech stack as well as the layout of his about me section. However, i also tried to give it my own ideas, making it more pill shaped and with more of a glassmorphism style.
>
> On top of this, I was reading some articles about Vercel's Geist font and decided to use their [Geist Mono](https://vercel.com/font?type=mono) font as I have always been a fan of [Jetbrains Mono](https://www.jetbrains.com/lp/mono/) and thought that I would give something new a try. Safe to say, I'm already a fan of how it looks..
>
> I would like to introduce some backend features into my portfolio as I have done with my others, such as live github and discord integration pages. I am not sure how I will do this yet but given that I have built my own version of Coolify and deployed it on my homelab, it shouldn't be too much of a roadblock to have to pay to deploy it as of now.
>
> I would also like to make this site more polished and professional as I would like for it to stick around for a bit longer even if that means lots of iterations.



## Development

> After reading my ramble, you'd probably like to know how to actually work on and deploy this site. I think that's fair, everything is set up for quick development and deployment with just a few commands. the instructions are below to get started! 🤗



### Local Development

1. **Clone the repository**:
  ```
    git clone https://github.com/clarkpy/clarkportfolio
    cd clarkportfolio
  ```
2. **Install dependencies**:
  ```
    npm install
  ```
3. **Start the dev server**:
  ```
    npm run dev
  ```
   This will launch the site locally, usually at [http://localhost:5173](http://localhost:5173) (or the port Vite chooses). The site auto-reloads on code file saves.

---



### Deployment

To build and deploy the site for production:

1. **Build the production files**:
  ```
    npm run build
  ```
    This will output the production files into the `dist/` directory.
2. **Preview the production build** (u don't have to do this but i like to):
  ```
    npm run preview
  ```
    This serves the built files locally for checking.
3. **Deploy**:
  - **Static Hosts**: You can deploy the contents of `dist/` to any static hosting provider (e.g., Vercel, Netlify, GitHub Pages, ClarkLab, etc.).
  - **Vercel Deploy Example**:
    - Push your repository to GitHub.
    - Sign in to [Vercel](https://vercel.com), click "New Project", and import your repo.
    - Vercel will auto-detect it's a Vite+React app and do the rest for ya!

---

That should be all! If you run into any issues, shoot me an email at [aj@clarklab.tech](mailto:aj@clarklab.tech). Happy Coding!

### AI Disclosure

> This project uses minimal AI. I use Cursor as an IDE for code completions and agentic assistance when i'm stuck. I used ChatGPT for assistance with documentations and for getting help with [motion](https://motion.dev)