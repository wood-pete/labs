import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, columns } from "../data.js";

const playableColumns = columns.filter((column) => column.key !== "category");
const MISSING_COUNT = 15;

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createMissingCells(count) {
  const allCells = [];

  categories.forEach((row, rowIndex) => {
    playableColumns.forEach((column) => {
      allCells.push({
        id: `${rowIndex}-${column.key}`,
        rowIndex,
        columnKey: column.key,
        columnLabel: column.label,
        rowLabel: row.category,
        value: row[column.key],
      });
    });
  });

  if (count > allCells.length) {
    throw new Error("Requested more missing cells than available table entries.");
  }

  return shuffle(allCells).slice(0, count);
}

export default function CloudMatchupApp() {
  const [missingCells, setMissingCells] = useState(() =>
    createMissingCells(MISSING_COUNT),
  );
  const [placements, setPlacements] = useState({});
  const [tileDeck, setTileDeck] = useState(() => shuffle([...missingCells]));
  const [clues, setClues] = useState({});
  const [feedback, setFeedback] = useState(null);
  const clueTimersRef = useRef({});

  const clearAllClueTimers = () => {
    Object.values(clueTimersRef.current).forEach((timerId) => {
      clearTimeout(timerId);
    });
    clueTimersRef.current = {};
  };

  const hideClueForTile = (tileId) => {
    setClues((prev) => {
      if (!prev[tileId]) {
        return prev;
      }
      const next = { ...prev };
      delete next[tileId];
      return next;
    });
    if (clueTimersRef.current[tileId]) {
      clearTimeout(clueTimersRef.current[tileId]);
      delete clueTimersRef.current[tileId];
    }
  };

  const missingLookup = useMemo(() => {
    const lookup = {};
    missingCells.forEach((cell) => {
      lookup[cell.id] = cell;
    });
    return lookup;
  }, [missingCells]);

  const placedCount = useMemo(
    () => Object.values(placements).filter(Boolean).length,
    [placements],
  );

  useEffect(() => {
    clearAllClueTimers();
    setClues({});
    setTileDeck(shuffle([...missingCells]));
    setPlacements({});
    setFeedback(null);
    return () => {
      clearAllClueTimers();
    };
  }, [missingCells]);

  const handleDragStart = (event, tileId) => {
    event.dataTransfer.setData("text/plain", tileId);
    event.dataTransfer.effectAllowed = "move";
    setFeedback(null);
  };

  const handleDrop = (event, cellId) => {
    event.preventDefault();
    const tileId = event.dataTransfer.getData("text/plain");
    if (!tileId || !missingLookup[cellId]) {
      return;
    }
    if (placements[cellId]) {
      setFeedback({
        type: "info",
        message: "That spot is already filled. Try another gap.",
      });
      return;
    }

    if (tileId !== cellId) {
      const attempted = missingLookup[tileId];
      setFeedback({
        type: "error",
        message: attempted
          ? `Not quite. "${attempted.value}" belongs under ${attempted.columnLabel} for ${attempted.rowLabel}.`
          : "Not quite. Try a different tile.",
      });
      return;
    }

    setPlacements((prev) => ({
      ...prev,
      [cellId]: true,
    }));
    hideClueForTile(cellId);
    const matchedCell = missingLookup[cellId];
    setFeedback({
      type: "success",
      message: `Matched "${matchedCell.value}" to ${matchedCell.columnLabel} (${matchedCell.rowLabel}).`,
    });
  };

  const handleClueClick = (event, tileId) => {
    event.stopPropagation();
    event.preventDefault();
    if (placements[tileId]) {
      return;
    }

    setFeedback(null);
    setClues((prev) => ({
      ...prev,
      [tileId]: true,
    }));

    if (clueTimersRef.current[tileId]) {
      clearTimeout(clueTimersRef.current[tileId]);
    }

    clueTimersRef.current[tileId] = setTimeout(() => {
      hideClueForTile(tileId);
    }, 2000);
  };

  const handleReset = () => {
    clearAllClueTimers();
    setClues({});
    setMissingCells(createMissingCells(MISSING_COUNT));
  };

  const allMatched = placedCount === missingCells.length;

  return (
    <div className="box-border flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f5f5] px-1 pb-0 pt-2 text-neutral-900 sm:px-2 sm:pb-0 sm:pt-4">
      <header className="flex-shrink-0 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-8 items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition hover:border-red-600 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:h-9 sm:px-4 sm:text-xs"
          >
            Home
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">
            Cloud Platform Match-Up
          </h1>
        </div>
        <p className="text-xs text-neutral-600 sm:text-sm">
          Drag the missing platform capabilities onto the correct provider
          column. Each tile can only live in one spot, and there are{" "}
          {missingCells.length} gaps to fill.
        </p>
      </header>

      <section className="mt-2.5 flex-shrink-0 rounded-2xl border border-neutral-200 bg-white p-3 shadow-[0_10px_28px_rgba(0,0,0,0.06)] sm:p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Missing Tiles</h2>
          <div className="text-sm text-neutral-700">
            {placedCount} / {missingCells.length} placed
          </div>
        </div>
        <div className="max-h-56 overflow-y-auto pr-1 sm:max-h-64 lg:max-h-72">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 lg:grid-cols-10">
            {tileDeck.map((tile) => {
              const isPlaced = Boolean(placements[tile.id]);
              const showClue = Boolean(clues[tile.id] || isPlaced);
              const labelText = showClue ? tile.columnLabel : "";
              return (
                <div
                  key={tile.id}
                  draggable={!isPlaced}
                  onDragStart={(event) => {
                    if (isPlaced) {
                      event.preventDefault();
                      return;
                    }
                    handleDragStart(event, tile.id);
                  }}
                  className={`relative flex flex-col justify-between rounded-md border px-1.5 py-1 text-left text-[9px] leading-tight transition sm:text-[10px] ${
                    isPlaced
                      ? "cursor-not-allowed border-green-500 bg-green-50 text-green-800"
                      : "cursor-move border-red-600 bg-red-600 text-white shadow-[0_6px_16px_rgba(225,6,0,0.25)] hover:bg-red-500"
                  }`}
                >
                  <div className="pr-6 text-[10px] font-semibold text-inherit sm:text-xs">
                    {tile.value}
                  </div>
                  {showClue ? (
                    <span
                      className={`mt-1 block text-[9px] font-bold uppercase tracking-wide sm:text-[10px] ${
                        isPlaced ? "text-green-800" : "text-white"
                      }`}
                    >
                      {labelText}
                    </span>
                  ) : (
                    <span className="mt-1 block h-3" aria-hidden="true" />
                  )}
                  {!isPlaced && (
                    <button
                      type="button"
                      onClick={(event) => handleClueClick(event, tile.id)}
                      className="absolute bottom-1 right-1 rounded bg-white px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-red-700 shadow-sm ring-1 ring-neutral-200 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-red-600"
                    >
                      Clue
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-2.5 flex-1 min-h-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
        <div className="flex h-full flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
            <table className="min-w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-neutral-900 text-left text-white">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-3 py-2 font-semibold uppercase tracking-wide"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((row, rowIndex) => (
                  <tr key={row.category} className="border-b border-neutral-200 last:border-none">
                    <td className="bg-neutral-50 px-3 py-2 font-semibold text-neutral-900">
                      {row.category}
                    </td>
                    {playableColumns.map((column) => {
                      const cellId = `${rowIndex}-${column.key}`;
                      const isMissing = Boolean(missingLookup[cellId]);
                      const isFilled = placements[cellId];
                      return (
                        <td key={column.key} className="px-3 py-2 align-top">
                          {isMissing ? (
                            <div
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => handleDrop(event, cellId)}
                              className={`flex min-h-[72px] items-center justify-center rounded-md border p-2 text-center transition ${
                                isFilled
                                  ? "border-green-500 bg-green-50 text-green-800"
                                  : "border-dashed border-neutral-300 bg-neutral-50 text-neutral-500"
                              }`}
                            >
                              {isFilled
                                ? missingLookup[cellId].value
                                : "Drop tile here"}
                            </div>
                          ) : (
                            <div className="min-h-[72px] rounded-md border border-transparent bg-neutral-50 p-2 text-neutral-800">
                              {row[column.key]}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer className="mt-2.5 flex-shrink-0 rounded-t-2xl border border-neutral-200 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-2 px-3 pb-1 pt-2 sm:px-4 sm:pb-1">
          {feedback ? (
            <div
              className={`rounded-md border px-3 py-2 text-sm ${
                feedback.type === "success"
                  ? "border-green-500 bg-green-50 text-green-800"
                  : feedback.type === "info"
                    ? "border-neutral-300 bg-neutral-50 text-neutral-700"
                    : "border-red-500 bg-red-50 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          ) : (
            <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
              Tip: match by thinking about which vendor offers the capability described on each tile.
            </div>
          )}

          {allMatched && (
            <div className="rounded-md border border-green-500/80 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
              Fantastic! You matched every capability. Try a fresh board to test again.
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(225,6,0,0.25)] hover:bg-red-500"
            >
              Reset with new gaps
            </button>
            <button
              type="button"
              onClick={() => {
                clearAllClueTimers();
                setClues({});
                setPlacements({});
                setTileDeck(shuffle([...missingCells]));
                setFeedback(null);
              }}
              className="rounded-md border border-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-900 hover:border-red-600 hover:text-red-700"
            >
              Clear placements
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
