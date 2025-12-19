import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const STORAGE_KEY = "circleconnect-seven-vs-memo";

const defaultMemo = {
  to: "Executive Leadership Team",
  subject: "Root Cause Analysis – Diagnosing Data Challenges at CircleConnect",
  closing: "",
  vs: {
    velocity: { issue: "", impact: "", fix: "" },
    variety: { issue: "", impact: "", fix: "" },
    veracity: { issue: "", impact: "", fix: "" },
    value: { issue: "", impact: "", fix: "" },
    variability: { issue: "", impact: "", fix: "" },
    volatility: { issue: "", impact: "", fix: "" },
    volume: { issue: "", impact: "", fix: "" },
  },
};

const vsConfig = [
  {
    key: "velocity",
    label: "Velocity",
    explain:
      "Velocity captures how quickly data is generated, ingested, processed, and made available so teams can act in time.",
    clue: [
      "Nightly batch ETL keeps dashboards 24–36 hours behind sales.",
      "Teams need same-day visibility to react to promotions.",
      "Consider streaming or micro-batch refresh to modernise cadence.",
    ],
    help: {
      issue: "Nightly batch pipelines leave dashboards 24–36 hours behind real-time sales.",
      impact: "Leaders miss daily performance signals and react too late to promotions.",
      fix: "Introduce streaming ingestion or incremental refresh to accelerate data delivery.",
    },
  },
  {
    key: "variety",
    label: "Variety",
    explain:
      "Variety looks at the mix of data sources, structures, and formats that must be unified for a coherent view.",
    clue: [
      "SAP, Salesforce, Shopify, Oracle Retail, and IoT feeds all have mismatched formats.",
      "Teams reconcile data manually because semantics diverge by system.",
      "Think about standardising definitions with a catalog or semantic layer.",
    ],
    help: {
      issue: "Disparate SAP, Salesforce, Shopify, and IoT sources use conflicting schemas.",
      impact: "Analysts spend hours reconciling definitions, slowing cross-channel insights.",
      fix: "Stand up a semantic layer and shared catalog to harmonise business terminology.",
    },
  },
  {
    key: "veracity",
    label: "Veracity",
    explain:
      "Veracity addresses data quality, trustworthiness, lineage, and governance of business-critical metrics.",
    clue: [
      "Leadership cites duplicate customers and revenue deltas of 5–10%.",
      "Data lineage and audit trails are missing, eroding trust.",
      "Master data management and quality scoring could stabilise accuracy.",
    ],
    help: {
      issue: "Duplicate customer/product records and missing lineage drive 5–10% reporting gaps.",
      impact: "Finance and Ops dispute revenue totals, eroding trust in dashboards.",
      fix: "Roll out MDM, data quality scoring, and lineage visibility for critical entities.",
    },
  },
  {
    key: "value",
    label: "Value",
    explain:
      "Value focuses on the business relevance and actionable insights delivered from the data estate.",
    clue: [
      "Dashboards are mostly descriptive, showing trend lines but not actions.",
      "A stalled AI pilot has board attention yet delivers no outcomes.",
      "Highlight use cases that embed insights into workflows for tangible wins.",
    ],
    help: {
      issue: "Analytics stay descriptive; stalled AI pilots fail to deliver proactive guidance.",
      impact: "Business stakeholders see dashboards as rear-view only and disengage.",
      fix: "Deliver predictive alerts and embed recommendations into operational workflows.",
    },
  },
  {
    key: "variability",
    label: "Variability",
    explain:
      "Variability highlights inconsistent data volumes, schema drift, and spikes that disrupt reliable delivery.",
    clue: [
      "Workloads spike at promotions, month-end, and product launches.",
      "Pipeline failures force analysts to rerun jobs manually overnight.",
      "Adaptive orchestration or auto-scaling infrastructure may help.",
    ],
    help: {
      issue: "Holiday spikes and month-end closes overwhelm brittle batch schedules.",
      impact: "Pipelines fail unpredictably, forcing nightly manual reruns by analysts.",
      fix: "Adopt resilient orchestration with auto-scaling to absorb demand surges.",
    },
  },
  {
    key: "volatility",
    label: "Volatility",
    explain:
      "Volatility considers how data changes over time, including retention, lifecycle policies, and stability.",
    clue: [
      "S3 acts as a dumping ground: no retention, no lifecycle rules.",
      "Storage and compute spend tripled over two years.",
      "Consider tiered storage strategies and enforce archival policies.",
    ],
    help: {
      issue: "Transactional and IoT logs accumulate indefinitely across S3 and Synapse.",
      impact: "Storage/compute spend triples and query performance degrades.",
      fix: "Enforce lifecycle tiers, archiving cold data while keeping recent data hot.",
    },
  },
  {
    key: "volume",
    label: "Volume",
    explain:
      "Volume measures the sheer amount of data under management and whether platforms scale cost-effectively.",
    clue: [
      "IoT telemetry and omnichannel data keep expanding beyond 50 TB.",
      "Existing warehouse performance degrades under the growth curve.",
      "Explore lakehouse patterns or scalable file formats to keep pace.",
    ],
    help: {
      issue: "Omnichannel and IoT growth pushes the estate beyond 50 TB with no scaling plan.",
      impact: "Warehouse queries slow down and compute burn rises exponentially.",
      fix: "Move toward a governed lakehouse with scalable storage formats and ACID support.",
    },
  },
];

const createInitialPanels = () =>
  vsConfig.reduce((acc, { key }) => {
    acc[key] = false;
    return acc;
  }, {});

export default function SevenVsApp() {
  const [memo, setMemo] = useState(defaultMemo);
  const [isReady, setIsReady] = useState(false);
  const [openClues, setOpenClues] = useState({});
  const [openPanels, setOpenPanels] = useState(createInitialPanels);
  const [lastSaved, setLastSaved] = useState(null);
  const [openExplain, setOpenExplain] = useState(null);
  const [showClosingTip, setShowClosingTip] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const { date: _ignoredDate, from: _ignoredFrom, ...rest } = parsed || {};
        setMemo({ ...defaultMemo, ...rest });
      }
    } catch (error) {
      console.warn("Unable to load saved memo", error);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memo));
      setLastSaved(new Date());
    } catch (error) {
      console.warn("Unable to persist memo", error);
    }
  }, [memo, isReady]);

  const saveStatus = useMemo(() => {
    if (!lastSaved) return "Draft saved locally.";
    return `Draft saved locally at ${lastSaved.toLocaleTimeString()}.`;
  }, [lastSaved]);

  const handleFieldChange = (field, value) => {
    setMemo((prev) => ({ ...prev, [field]: value }));
  };

  const handleVsChange = (key, subfield, value) => {
    setMemo((prev) => ({
      ...prev,
      vs: {
        ...prev.vs,
        [key]: {
          ...prev.vs[key],
          [subfield]: value,
        },
      },
    }));
  };

  const handleReset = () => {
    setMemo(defaultMemo);
    setOpenClues({});
    setOpenPanels(createInitialPanels());
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setLastSaved(new Date());
  };

  const toggleExplain = (key) => {
    setOpenExplain((prev) => (prev === key ? null : key));
  };

  const toggleClue = (key) => {
    setOpenClues((prev) => {
      const nextValue = !prev[key];
      if (nextValue) {
        setOpenPanels((panels) =>
          panels[key] ? panels : { ...panels, [key]: true }
        );
      }
      return { ...prev, [key]: nextValue };
    });
  };

  const togglePanel = (key) => {
    setOpenPanels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeExplain = useMemo(() => {
    if (!openExplain) return null;
    const match = vsConfig.find((item) => item.key === openExplain);
    if (!match || !match.explain) return null;
    return { label: match.label, text: match.explain };
  }, [openExplain]);
  const closingTipText = useMemo(
    () =>
      [
        "Immediate Priorities:",
        "- Stand up a data reliability squad to deliver trusted revenue dashboards within 60 days.",
        "- Launch Project Helix control tower to coordinate finance, marketing, and operations data remediation.",
        "",
        "Risk & Governance:",
        "- Embed data ownership in each business unit with shared definitions and automated quality scoring.",
        "- Secure board investment for lifecycle and cost-optimisation initiatives to curb spend spikes.",
        "",
        "Measuring Impact:",
        "- Target <5% variance across systems, near-real-time executive dashboards, and 30% lower cloud spend by year-end.",
      ].join("\n"),
    []
  );
  const closingPrefilled = useMemo(() => {
    const current = memo.closing ?? "";
    return current.includes(closingTipText);
  }, [memo.closing, closingTipText]);

  const handleClosingWrite = () => {
    setMemo((prev) => {
      const existing = prev.closing ?? "";
      if (existing.includes(closingTipText)) {
        return prev;
      }
      const trimmed = existing.trim();
      const nextClosing = trimmed
        ? `${trimmed}\n\n${closingTipText}`
        : closingTipText;
      return { ...prev, closing: nextClosing };
    });
  };

  const todayDisplay = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (typeof window === "undefined") return;
    setIsGeneratingPdf(true);
    try {
      const ensureValue = (value, placeholder = "Not captured yet.") => {
        const trimmed = (value ?? "").trim();
        return trimmed.length ? trimmed : placeholder;
      };

      const pdfDoc = await PDFDocument.create();
      const regularFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const accentColor = rgb(0.2, 0.2, 0.2);
      const bodyColor = rgb(0.1, 0.1, 0.1);

      const margin = 50;
      const lineSpacing = 1.4;
      let page = pdfDoc.addPage();
      let cursorY = page.getHeight() - margin;
      const maxWidth = () => page.getWidth() - margin * 2;

      const addPage = () => {
        page = pdfDoc.addPage();
        cursorY = page.getHeight() - margin;
      };

      const ensureSpace = (heightNeeded) => {
        if (cursorY - heightNeeded < margin) {
          addPage();
        }
      };

      const wrapText = (text, font, size, availableWidth) => {
        if (!text) return [" "];
        const words = text.split(/\s+/);
        const lines = [];
        let line = "";
        for (const word of words) {
          const candidate = line ? `${line} ${word}` : word;
          if (font.widthOfTextAtSize(candidate, size) <= availableWidth) {
            line = candidate;
          } else {
            if (line) lines.push(line);
            line = word;
          }
        }
        if (line) lines.push(line);
        return lines.length ? lines : [" "];
      };

      const drawWrappedBlock = (
        text,
        {
          font = regularFont,
          size = 11,
          lineHeight = size * lineSpacing,
          indent = 0,
          fallback = "Not captured yet.",
        } = {}
      ) => {
        const cleaned = (text ?? "").replace(/\r/g, "");
        if (!cleaned.trim()) {
          ensureSpace(lineHeight);
          page.drawText(fallback, {
            x: margin + indent,
            y: cursorY - size,
            size,
            font,
            color: bodyColor,
          });
          cursorY -= lineHeight;
          return;
        }

        const rawLines = cleaned.split("\n");
        rawLines.forEach((rawLine) => {
          const original = rawLine.replace(/\r/g, "");
          if (!original.trim()) {
            cursorY -= lineHeight * 0.7;
            return;
          }
          const bulletMatch = original.match(/^\s*([*-•])\s*(.*)$/);
          const isBullet = !!bulletMatch;
          const contentRaw = isBullet ? bulletMatch?.[2] ?? "" : original.trim();
          const content = contentRaw.trim();
          const bulletPrefix = "• ";
          const bulletPrefixWidth = font.widthOfTextAtSize(bulletPrefix, size) + 2;
          const textIndent = isBullet ? bulletPrefixWidth : 0;
          const availableWidth = maxWidth() - indent - textIndent;
          const lines = wrapText(content, font, size, availableWidth);
          lines.forEach((line, index) => {
            ensureSpace(lineHeight);
            const prefix = isBullet && index === 0 ? bulletPrefix : "";
            const drawX = margin + indent + (isBullet && index > 0 ? textIndent : 0);
            page.drawText(`${prefix}${line}`, {
              x: drawX,
              y: cursorY - size,
              size,
              font,
              color: bodyColor,
            });
            cursorY -= lineHeight;
          });
        });
      };

      const drawSectionHeading = (title) => {
        const size = 14;
        const lineHeight = size * 1.6;
        ensureSpace(lineHeight);
        page.drawText(title, {
          x: margin,
          y: cursorY - size,
          size,
          font: boldFont,
          color: accentColor,
        });
        cursorY -= lineHeight;
      };

      const drawLabelBlock = (label, value) => {
        const labelSize = 11.5;
        const lineHeight = labelSize * lineSpacing;
        ensureSpace(lineHeight);
        page.drawText(`${label}:`, {
          x: margin,
          y: cursorY - labelSize,
          size: labelSize,
          font: boldFont,
          color: accentColor,
        });
        cursorY -= lineHeight;
        drawWrappedBlock(value, { indent: 12, size: 11 });
        cursorY -= 2;
      };

      const drawHeaderLine = (text, size = 12, font = regularFont) => {
        const lineHeight = size * lineSpacing;
        ensureSpace(lineHeight);
        page.drawText(text, {
          x: margin,
          y: cursorY - size,
          size,
          font,
          color: bodyColor,
        });
        cursorY -= lineHeight;
      };

      // Executive memo header
      const titleSize = 20;
      const titleLineHeight = titleSize * 1.6;
      ensureSpace(titleLineHeight);
      page.drawText("Executive Memo — Seven V's Diagnostic", {
        x: margin,
        y: cursorY - titleSize,
        size: titleSize,
        font: boldFont,
        color: accentColor,
      });
      cursorY -= titleLineHeight;

      drawHeaderLine(`Subject: ${ensureValue(memo.subject, "Root Cause Analysis – Diagnosing Data Challenges")}`, 12, boldFont);
      drawHeaderLine(`To: ${ensureValue(memo.to, defaultMemo.to)}`);
      drawHeaderLine(`Date: ${todayDisplay}`);
      drawHeaderLine("Prepared via SevenVs Executive Memo Lab");
      cursorY -= 6;

      drawSectionHeading("Executive Summary");
      drawWrappedBlock(memo.closing, {
        size: 11,
        indent: 0,
        fallback: "No closing recommendations captured yet.",
      });
      cursorY -= 8;

      vsConfig.forEach(({ key, label }) => {
        const fields = memo.vs[key] ?? {};
        drawSectionHeading(label);
        drawLabelBlock("Issue", ensureValue(fields.issue));
        drawLabelBlock("Impact", ensureValue(fields.impact));
        drawLabelBlock("Fix", ensureValue(fields.fix));
        cursorY -= 6;
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 10);
      link.href = blobUrl;
      link.download = `SevenVs_Executive_Memo_${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error("Unable to create memo PDF", error);
      window.alert?.(
        "Sorry, something went wrong while creating the PDF. Please try again."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [memo, todayDisplay]);

  return (
    <div className="flex min-h-[70vh] flex-col gap-6 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/"
          className="inline-flex h-7 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-8 sm:px-3 sm:text-[10px]"
        >
          Home
        </Link>
        <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
          Executive Memo Lab: The 7 V&apos;s Diagnostic
        </h2>
      </div>

      <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-700">
          <span className="rounded-full border border-neutral-300 bg-neutral-50 px-2 py-1">
            {saveStatus}
          </span>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            aria-busy={isGeneratingPdf}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500"
          >
            {isGeneratingPdf ? "Creating..." : "Create PDF"}
          </button>
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="rounded-full border border-red-600/70 bg-red-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-700 transition hover:border-red-600 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Reset Draft
          </button>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
        <header className="grid gap-3 text-sm text-neutral-700 sm:text-base">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-red-600">
              Executive memo header
            </p>
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-600">
              Date: {todayDisplay}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <MemoField
              label="To"
              value={memo.to}
              onChange={(value) => handleFieldChange("to", value)}
              placeholder="Executive Leadership Team"
            />
            <MemoField
              label="Subject"
              value={memo.subject}
              onChange={(value) => handleFieldChange("subject", value)}
              placeholder="Root Cause Analysis – Diagnosing Data Challenges at CircleConnect"
            />
          </div>
        </header>

      </section>

      <section className="grid gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
        <h3 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
          The 7 V&apos;s Diagnostic Canvas
        </h3>
        <p className="text-sm text-neutral-700 sm:text-base">
          For each dimension, capture the core issue, describe the business
          impact, and propose a focused fix. Tap the clue button if you need a
          nudge from the case study.
        </p>

        <div className="grid gap-5">
          {vsConfig.map((dimension, index) => {
            const { key, label, clue, help, explain } = dimension;
            const fields = memo.vs[key];
            const isOpen = !!openPanels[key];
            const isClueOpen = !!openClues[key];
            return (
              <div key={key} className="space-y-4">
                <article
                  className={[
                    "rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-inner shadow-black/5 transition sm:p-5",
                    isOpen ? "ring-1 ring-red-600/40 bg-white" : "",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => togglePanel(key)}
                    className="flex w-full items-center justify-between gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    aria-expanded={isOpen}
                    aria-controls={`${key}-panel`}
                  >
                    <span className="text-lg font-semibold text-neutral-900">
                      {label}
                    </span>
                    <span
                      className={[
                        "inline-flex h-6 w-6 items-center justify-center rounded-full border border-neutral-900 text-neutral-900 transition-transform duration-200",
                        "transform",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                    >
                      <ChevronIcon className="h-3 w-3" />
                    </span>
                  </button>

                  {isOpen ? (
                    <div
                      id={`${key}-panel`}
                      className="mt-4 space-y-4"
                      aria-hidden={!isOpen}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {explain ? (
                          <button
                            type="button"
                            onClick={() => toggleExplain(key)}
                            className="inline-flex h-7 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            aria-expanded={openExplain === key}
                            aria-label={`Explain ${label}`}
                          >
                            Explain
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => toggleClue(key)}
                          className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-800 transition hover:border-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        >
                          {isClueOpen ? "Hide clue" : "Show clue"}
                        </button>
                      </div>

                      {isClueOpen ? (
                        <ul className="grid gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700">
                          {clue.map((hint, hintIndex) => (
                            <li key={hintIndex} className="leading-relaxed">
                              • {hint}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                        <VsField
                          label="Issue"
                          value={fields.issue}
                          onChange={(value) =>
                            handleVsChange(key, "issue", value)
                          }
                          placeholder="What is broken or missing today?"
                          helpText={help?.issue}
                        />
                        <VsField
                          label="Impact"
                          value={fields.impact}
                          onChange={(value) =>
                            handleVsChange(key, "impact", value)
                          }
                          placeholder="Who feels the pain and how does it show up?"
                          helpText={help?.impact}
                        />
                        <VsField
                          label="Fix"
                          value={fields.fix}
                          onChange={(value) =>
                            handleVsChange(key, "fix", value)
                          }
                          placeholder="What targeted intervention will resolve it?"
                          helpText={help?.fix}
                        />
                      </div>
                    </div>
                  ) : null}
                </article>
                {index < vsConfig.length - 1 ? (
                  <div className="h-1 rounded-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent opacity-80" />
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-red-600">
          <span>Closing recommendations & next steps</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClosingWrite}
              className="rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-[10px] font-semibold tracking-[0.24em] text-white transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500"
              disabled={closingPrefilled}
            >
              Write it
            </button>
            <button
              type="button"
              onClick={() => setShowClosingTip(true)}
              className="rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-[10px] font-semibold tracking-[0.24em] text-neutral-800 transition hover:border-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Suggestions
            </button>
          </div>
        </div>
        <textarea
          value={memo.closing}
          onChange={(event) => handleFieldChange("closing", event.target.value)}
          rows={6}
          className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 shadow-inner shadow-black/10 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/40"
          placeholder="Outline the immediate actions the CEO and board should approve, and flag any strategic bets for Project Helix."
        />
      </section>

      {activeExplain ? (
        <ExplainModal
          title={activeExplain.label}
          description={activeExplain.text}
          onClose={() => setOpenExplain(null)}
        />
      ) : null}
      {showClosingTip ? (
        <ClosingTip onClose={() => setShowClosingTip(false)} />
      ) : null}
      {showResetConfirm ? (
        <ResetConfirmModal
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={() => {
            handleReset();
            setShowResetConfirm(false);
          }}
        />
      ) : null}

      <button
        type="button"
        onClick={() => setShowCompanyProfile(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full border border-red-600 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-2xl text-white shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-16 sm:w-16"
      >
        <span className="animate-pulse text-xl sm:text-2xl">🏢</span>
      </button>

      {showCompanyProfile ? (
        <CompanyProfileModal onClose={() => setShowCompanyProfile(false)} />
      ) : null}
    </div>
  );
}

function MemoField({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.3em] text-red-600">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 shadow-inner shadow-black/10 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
      />
    </label>
  );
}

function VsField({ label, value, onChange, placeholder, helpText }) {
  const handleHelp = () => {
    if (!helpText) return;
    const current = value ?? "";
    const trimmed = current.trim();
    if (!trimmed) {
      onChange(helpText);
      return;
    }
    if (current.includes(helpText)) return;
    onChange(`${current}\n${helpText}`);
  };

  return (
    <div className="grid gap-2 text-xs uppercase tracking-[0.25em] text-red-600">
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {helpText ? (
          <button
            type="button"
            onClick={handleHelp}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 text-white transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            title="Write the response for me"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        placeholder={placeholder}
        aria-label={label}
        className="h-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 shadow-inner shadow-black/10 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/30"
      />
    </div>
  );
}

function PencilIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 19l1.2-4.8 9.3-9.3a1.8 1.8 0 012.5 0l1.1 1.1a1.8 1.8 0 010 2.5l-9.3 9.3L5 19z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M5 19l4.2-1.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M14.5 5.5l3 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 2l8 8 8-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExplainModal({ title, description, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explain-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-sm text-neutral-800 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
        <header className="flex items-start justify-between gap-3">
          <h4
            id="explain-modal-title"
            className="text-lg font-semibold uppercase tracking-[0.2em] text-neutral-900"
          >
            {title} — Explained
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-base font-semibold text-neutral-800 transition hover:border-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close explanation"
          >
            ×
          </button>
        </header>
        <p className="mt-4 leading-relaxed text-neutral-700">{description}</p>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ClosingTip({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="closing-tip-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 text-sm text-neutral-800 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
        <header className="flex items-start justify-between gap-3">
          <h4
            id="closing-tip-title"
            className="text-lg font-semibold uppercase tracking-[0.2em] text-neutral-900"
          >
            Suggestions for the Memo Closing
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-base font-semibold text-neutral-800 transition hover:border-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close suggestions"
          >
            ×
          </button>
        </header>
        <ul className="mt-4 grid gap-3 text-neutral-700">
          <li>• Prioritise the top 2–3 investments to restore trust quickly.</li>
          <li>• Outline ownership, timeline, and cross-functional partners for Project Helix.</li>
          <li>• Highlight risk mitigation (e.g., governance, change management, funding).</li>
          <li>• Signal how success will be measured (speed to insight, cost savings, trust scores).</li>
        </ul>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanyProfileModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-profile-title"
    >
      <div className="relative h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_56px_rgba(0,0,0,0.2)]">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-6 py-4">
          <div>
            <h4
              id="company-profile-title"
              className="text-lg font-semibold uppercase tracking-[0.25em] text-neutral-900"
            >
              CircleConnect Company Brief
            </h4>
            <p className="text-xs uppercase tracking-[0.3em] text-red-600">
              Project Helix Context
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-base font-semibold text-neutral-800 transition hover:border-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close company profile"
          >
            ×
          </button>
        </header>

        <div className="h-full overflow-y-auto px-6 py-6 text-sm leading-relaxed text-neutral-800 sm:text-base">
          <section className="space-y-2">
            <h5 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              Snapshot
            </h5>
            <ul className="space-y-1 text-neutral-700">
              <li>🏢 Fictional Company: CircleConnect (CRCLCNCT / CRCL)</li>
              <li>Industry: Connected Retail &amp; Smart Consumer Services</li>
              <li>Headquarters: Manchester, UK</li>
              <li>Employees: 5,500</li>
              <li>Annual Revenue: £1.2 billion</li>
            </ul>
          </section>

          <section className="mt-6 space-y-3">
            <h5 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              Company Overview
            </h5>
            <p>
              CircleConnect (CRCL) is a UK-based connected commerce platform that
              integrates online retail, in-store experiences, and smart device
              data into a unified customer ecosystem. The company operates over
              200 physical experience stores alongside a fast-growing digital
              marketplace. Customers use the CircleConnect app to browse, buy, and
              manage devices ranging from wearables to home automation systems.
            </p>
            <p>
              During the pandemic, CRCL accelerated its digital expansion — but its
              data architecture hasn’t evolved at the same pace. Data flows from
              dozens of disconnected systems, each with different standards,
              formats, and refresh cycles. To address this, the executive team has
              launched Project Helix, an enterprise-wide transformation aimed at
              “rebuilding trust in our data foundation” and “enabling AI-driven,
              connected customer insights.”
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h5 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              The Situation
            </h5>
            <p>
              You’ve just joined CircleConnect as the new Chief Data Officer (CDO).
              On your very first day, you uncover a series of critical issues that
              sound all too familiar:
            </p>
            <ul className="space-y-1 pl-4 text-neutral-700">
              <li>• The CEO no longer trusts the dashboards.</li>
              <li>• The CFO says financial and sales numbers don’t match across platforms.</li>
              <li>• The Marketing team claims their analytics are outdated and fragmented.</li>
              <li>• The Operations team still uses spreadsheets to reconcile store data manually.</li>
            </ul>
            <p className="italic text-neutral-700">
              The board’s message is blunt: “Our data is scattered, our reports are inconsistent,
              and nobody trusts the numbers. Fix it.”
            </p>
          </section>

          <section className="mt-6 space-y-3">
            <h5 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              Data Landscape (Current State)
            </h5>
            <ul className="space-y-2 pl-4 text-neutral-700">
              <li>• Systems: SAP ERP, Salesforce CRM, Shopify Commerce, Oracle Retail, IoT telemetry feeds, and dozens of CSV exports from regional systems.</li>
              <li>• Data Warehouse: Azure Synapse, populated nightly via batch ETL.</li>
              <li>• Data Lake: Raw object storage on AWS S3 with minimal governance and no schema enforcement.</li>
              <li>• Tools: Power BI for dashboards, alongside Tableau, Excel, and ad-hoc Python scripts.</li>
              <li>• Data Team: 40 analysts and engineers scattered across IT, Finance, and Marketing, each using different datasets and definitions.</li>
              <li>• AI/ML Projects: A stalled recommendation-engine pilot in Spark, paused due to poor data quality and missing lineage.</li>
            </ul>
          </section>

          <section className="mt-6 space-y-3">
            <h5 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
              Symptoms Noted by Leadership
            </h5>
            <ol className="space-y-2 pl-4 text-neutral-700">
              <li>1. Dashboards are 24–36 hours behind real-time sales activity.</li>
              <li>2. Revenue totals differ by 5–10% between systems.</li>
              <li>3. Duplicate customer and product records exist across multiple sources.</li>
              <li>4. Marketing reports show engagement metrics but no conversion tracking.</li>
              <li>5. Cloud storage and compute costs have tripled in two years.</li>
              <li>6. Analysts rerun failed pipelines nightly because of dependency errors.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}

function ResetConfirmModal({ onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-confirm-title"
    >
      <div className="w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 text-sm text-neutral-800 shadow-[0_18px_48px_rgba(0,0,0,0.18)]">
        <h4
          id="reset-confirm-title"
          className="text-lg font-semibold uppercase tracking-[0.3em] text-neutral-900"
        >
          Reset Draft?
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          This will clear every field and remove your saved memo from this
          browser. You cannot undo this action.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-800 transition hover:border-red-600 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full border border-red-600 bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Reset Now
          </button>
        </div>
      </div>
    </div>
  );
}
