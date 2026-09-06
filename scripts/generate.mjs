#!/usr/bin/env node
/**
 * Generates README.md from README.template.md.
 *
 * Source of truth is the config in the portfolio site repo, not this file.
 * The site and this profile therefore cannot drift: CI regenerates and fails
 * on any diff, and a weekly job picks up changes made on the site side.
 */

import { writeFileSync, readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const SITE_REPO = "easywebdev4u/thealchemyst.dev";
const RAW = `https://raw.githubusercontent.com/${SITE_REPO}/main`;

/**
 * Display-name overrides applied after loading site config.
 * Remove an entry once the site config itself is corrected.
 */
const COMPANY_OVERRIDES = {
  PandaMoney: "ZoltMoney", // rebranded; site config still carries the old name
};

/** Roles rendered expanded rather than collapsed. */
const FEATURED = 1;

/** Skill categories promoted into the summary table, in this order. */
const STACK_ORDER = [
  "Languages", "Frontend", "Backend", "State Management",
  "Web3 & Blockchain", "Cloud & DevOps", "Databases", "Styling", "Tools",
];

async function loadConfig(path, exportName) {
  const res = await fetch(`${RAW}/${path}`);
  if (!res.ok) throw new Error(`fetch ${path} -> HTTP ${res.status}`);
  const ts = await res.text();

  // The site's config files import shared types. Those imports are
  // type-only at runtime, so strip them rather than resolving the alias.
  const stripped = ts.replace(/^\s*import\s[^;]+;\s*$/gm, "");

  const dir = mkdtempSync(join(tmpdir(), "profilegen-"));
  const tsFile = join(dir, "config.ts");
  const jsFile = join(dir, "config.mjs");
  writeFileSync(tsFile, stripped);

  // No --loader flag: esbuild infers TS from the .ts extension, and passing
  // it explicitly is an error for file (non-stdin) input.
  execFileSync("npx", ["--yes", "esbuild@0.24", tsFile,
    "--format=esm", `--outfile=${jsFile}`], { stdio: "pipe" });

  const mod = await import(pathToFileURL(jsFile).href);
  if (!(exportName in mod)) throw new Error(`${path} has no export "${exportName}"`);
  return mod[exportName];
}

const esc = (s) => String(s).replace(/\|/g, "\\|");
const company = (name) => COMPANY_OVERRIDES[name] ?? name;

function renderRole(role, expanded) {
  const tech = role.tech?.length ? ` &nbsp;·&nbsp; <i>${role.tech.join(", ")}</i>` : "";
  const bullets = role.highlights.map((h) => `- ${h}`).join("\n");
  return [
    `<details${expanded ? " open" : ""}>`,
    `<summary><b>${company(role.company)}</b> — ${role.title}, ${role.period}${tech}</summary>`,
    ``,
    `<br>`,
    ``,
    `<sub>${role.location}</sub>`,
    ``,
    bullets,
    ``,
    `</details>`,
  ].join("\n");
}

function renderStack(categories) {
  const byLabel = new Map(categories.map((c) => [c.label, c]));
  const ordered = [
    ...STACK_ORDER.filter((l) => byLabel.has(l)).map((l) => byLabel.get(l)),
    ...categories.filter((c) => !STACK_ORDER.includes(c.label)),
  ];
  const rows = ordered.map((c) => {
    const expert = c.skills.filter((s) => s.level === "Expert").map((s) => `**${s.name}**`);
    const rest = c.skills.filter((s) => s.level !== "Expert").map((s) => s.name);
    return `| **${esc(c.label)}** | ${[...expert, ...rest].map(esc).join(" · ")} |`;
  });
  return ["| | |", "|---|---|", ...rows].join("\n");
}

function fill(template, key, body) {
  const re = new RegExp(`(<!-- BEGIN:${key} -->)[\\s\\S]*?(<!-- END:${key} -->)`);
  if (!re.test(template)) throw new Error(`template is missing marker "${key}"`);
  return template.replace(re, `$1\n${body}\n$2`);
}

const [personal, roles, categories] = await Promise.all([
  loadConfig("src/config/personal.ts", "personal"),
  loadConfig("src/config/experience.ts", "roles"),
  loadConfig("src/config/skills.ts", "categories"),
]);

let out = readFileSync("README.template.md", "utf8");

out = fill(out, "experience",
  roles.map((r, i) => renderRole(r, i < FEATURED)).join("\n\n"));
out = fill(out, "stack", renderStack(categories));
out = fill(out, "links", [
  `**[${personal.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}](${personal.linkedin})**`,
].join(""));
out = fill(out, "tagline", personal.tagline);

const banner = "<!-- Generated from README.template.md by scripts/generate.mjs. Do not edit directly. -->\n";
writeFileSync("README.md", banner + out);

const years = roles.length;
console.log(`generated README.md — ${years} roles, ${categories.length} skill categories`);
