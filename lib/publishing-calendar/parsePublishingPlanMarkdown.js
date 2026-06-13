/**
 * Parse a 7-day publishing plan markdown table pasted from AI research.
 * Expects a markdown table with header row containing: Day, Phase, Channel, etc.
 */

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function normalizeHeader(h) {
  return h.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function parseMetadataBlock(text) {
  const meta = {};
  const patterns = [
    ["topic", /(?:^|\n)\s*topic\s*[:：]\s*(.+)/i],
    ["topic_type", /(?:^|\n)\s*topic[_\s]?type\s*[:：]\s*(.+)/i],
    ["primary_audience", /(?:^|\n)\s*primary[_\s]?audience\s*[:：]\s*(.+)/i],
    ["primary_asset", /(?:^|\n)\s*primary[_\s]?asset\s*[:：]\s*(.+)/i],
    ["campaign_intensity", /(?:^|\n)\s*campaign[_\s]?intensity\s*[:：]\s*(.+)/i],
    ["default_cta", /(?:^|\n)\s*default[_\s]?cta\s*[:：]\s*(.+)/i],
    ["research_needed", /(?:^|\n)\s*research[_\s]?needed\s*[:：]\s*(.+)/i],
    ["compliance_note", /(?:^|\n)\s*compliance[_\s]?note\s*[:：]\s*(.+)/i],
  ];
  for (const [key, re] of patterns) {
    const m = text.match(re);
    if (m) meta[key] = m[1].trim();
  }
  return meta;
}

export function parsePublishingPlanMarkdown(markdown) {
  const errors = [];
  const meta = parseMetadataBlock(markdown);
  const lines = markdown.split("\n").filter((l) => l.trim().startsWith("|"));

  if (lines.length < 2) {
    return { rows: [], meta, errors: ["No markdown table found. Paste a table with | Day | Channel | ..."] };
  }

  const headerCells = splitTableRow(lines[0]);
  const headers = headerCells.map(normalizeHeader);
  const sepIdx = lines.findIndex((l) => /^\|\s*[-:]+/.test(l));
  const dataLines = sepIdx >= 0 ? lines.slice(sepIdx + 1) : lines.slice(1);

  const col = (cells, ...names) => {
    for (const name of names) {
      const i = headers.indexOf(name);
      if (i >= 0 && cells[i]) return cells[i];
    }
    return "";
  };

  const rows = [];

  for (const line of dataLines) {
    if (!line.includes("|")) continue;
    const cells = splitTableRow(line);
    if (cells.every((c) => !c || /^-+$/.test(c))) continue;

    const dayRaw = col(cells, "day", "day_number", "day_1_7");
    const dayMatch = dayRaw.match(/(\d+)/);
    const day_number = dayMatch ? Number(dayMatch[1]) : rows.length + 1;

    rows.push({
      day_number,
      phase: col(cells, "phase", "plan_phase"),
      channel: col(cells, "channel", "platform"),
      channel_type: col(cells, "channel_type", "format", "type"),
      format_family: col(cells, "format_family", "format"),
      slot: col(cells, "slot", "time_slot"),
      dubai_time: col(cells, "dubai_time", "time", "scheduled_time", "pkt_time"),
      what_to_post: col(cells, "what_to_post", "content", "brief"),
      seo_ai_search_terms: col(cells, "seo_ai_search_terms", "seo", "search_terms"),
      cta_link: col(cells, "cta_link", "link"),
      cta: col(cells, "cta", "cta_copy"),
      follow_up_comment_action: col(cells, "follow_up_comment_action", "follow_up"),
      objective: col(cells, "objective", "goal"),
    });
  }

  if (!rows.length) errors.push("Table parsed but no data rows found.");

  return { rows, meta, errors };
}
