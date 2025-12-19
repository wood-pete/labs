import { useMemo } from "react";

function parseInlineSegments(text) {
  const segments = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      segments.push({ type: "link", text: match[1], href: match[2] });
    } else if (match[3]) {
      segments.push({ type: "strong", text: match[3] });
    } else if (match[4]) {
      segments.push({ type: "code", text: match[4] });
    } else if (match[5]) {
      segments.push({ type: "em", text: match[5] });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

function parseMarkdown(content) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let listItems = null;
  let codeBlock = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems && listItems.length) {
      blocks.push({ type: "list", items: listItems });
    }
    listItems = null;
  };

  const flushCode = () => {
    if (codeBlock) {
      blocks.push({
        type: "code",
        code: codeBlock.lines.join("\n"),
        language: codeBlock.language,
      });
      codeBlock = null;
    }
  };

  lines.forEach((line) => {
    if (codeBlock) {
      if (line.trim().startsWith("```")) {
        flushCode();
        return;
      }
      codeBlock.lines.push(line);
      return;
    }

    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph();
      flushList();
      const language = trimmed.slice(3).trim() || null;
      codeBlock = { language, lines: [] };
      return;
    }

    if (trimmed === "") {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = /^#{1,6}\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = trimmed.match(/^#+/)[0].length;
      blocks.push({ type: "heading", level, text: headingMatch[1] });
      return;
    }

    if (trimmed.startsWith(">")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "blockquote", text: trimmed.replace(/^>\s?/, "") });
      return;
    }

    const listMatch = /^-\s+(.*)$/.exec(trimmed);
    if (listMatch) {
      flushParagraph();
      if (!listItems) {
        listItems = [];
      }
      listItems.push(listMatch[1]);
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();
  flushCode();

  return blocks;
}

function renderInline(text) {
  return parseInlineSegments(text).map((segment, index) => {
    switch (segment.type) {
      case "strong":
        return (
          <strong key={index} className="font-semibold text-red-700">
            {segment.text}
          </strong>
        );
      case "em":
        return (
          <em key={index} className="text-neutral-800">
            {segment.text}
          </em>
        );
      case "code":
        return (
          <code
            key={index}
            className="rounded bg-neutral-100 px-1.5 py-0.5 text-red-700 shadow-inner shadow-black/10"
          >
            {segment.text}
          </code>
        );
      case "link":
        return (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-red-700 underline decoration-red-500 decoration-2 underline-offset-4 transition hover:text-red-600"
          >
            {segment.text}
          </a>
        );
      default:
        return <span key={index}>{segment.value}</span>;
    }
  });
}

export default function MarkdownRenderer({ content }) {
  const blocks = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 text-base leading-relaxed text-neutral-900 shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = `h${Math.min(block.level, 3)}`;
          const sizes = {
            1: "text-3xl sm:text-4xl",
            2: "text-2xl sm:text-3xl",
            3: "text-xl sm:text-2xl",
          };
          return (
            <Tag
              key={index}
              className={`font-semibold tracking-tight text-neutral-900 ${sizes[Math.min(block.level, 3)]}`}
            >
              {renderInline(block.text)}
            </Tag>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={index} className="text-neutral-700">
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              key={index}
              className="list-disc space-y-2 pl-5 text-neutral-800 marker:text-red-600"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-red-600/80 bg-neutral-50 px-4 py-3 text-neutral-800"
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-950/[0.03] p-4 text-sm text-neutral-900 shadow-inner shadow-black/10"
            >
              <code>{block.code}</code>
            </pre>
          );
        }

        return null;
      })}
    </div>
  );
}
