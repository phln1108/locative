import { Fragment, type ReactNode } from "react";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

type Block =
  | { type: "heading"; level: 1 | 2 | 3; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] };

function parseBlocks(content: string): Block[] {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const lines = normalized.split("\n");
  const blocks: Block[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    blocks.push({ type: "paragraph", content: paragraphBuffer.join(" ").trim() });
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer.length) return;
    blocks.push({ type: "list", items: [...listBuffer] });
    listBuffer = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length as 1 | 2 | 3,
        content: headingMatch[2].trim(),
      });
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      listBuffer.push(listMatch[1].trim());
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

function renderInline(content: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const pattern =
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)|\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)|\*\*([^*]+)\*\*|`([^`]+)`/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(content.slice(lastIndex, match.index));
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      tokens.push(
        <img
          key={`${match.index}-img`}
          src={match[2]}
          alt={match[1]}
          title={match[3] || match[1]}
          className="my-4 w-full rounded-xl border object-cover shadow-sm"
          loading="lazy"
        />
      );
    } else if (match[4] !== undefined && match[5] !== undefined) {
      tokens.push(
        <a
          key={`${match.index}-link`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          title={match[6] || match[4]}
          className="font-medium text-primary underline underline-offset-4"
        >
          {match[4]}
        </a>
      );
    } else if (match[7] !== undefined) {
      tokens.push(
        <strong key={`${match.index}-strong`} className="font-semibold text-foreground">
          {match[7]}
        </strong>
      );
    } else if (match[8] !== undefined) {
      tokens.push(
        <code
          key={`${match.index}-code`}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
        >
          {match[8]}
        </code>
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < content.length) {
    tokens.push(content.slice(lastIndex));
  }

  return tokens;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const HeadingTag = block.level === 1 ? "h3" : block.level === 2 ? "h4" : "h5";
          return (
            <HeadingTag key={`heading-${index}`} className="mt-5 mb-2 font-semibold text-foreground">
              {renderInline(block.content)}
            </HeadingTag>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="ml-5 list-disc space-y-2 text-muted-foreground">
              {block.items.map((item, itemIndex) => (
                <li key={`list-${index}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="leading-relaxed text-muted-foreground">
            {renderInline(block.content).map((node, nodeIndex) => (
              <Fragment key={`paragraph-${index}-${nodeIndex}`}>{node}</Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
