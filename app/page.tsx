"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Point = { x: number; y: number };
type RoomObject = {
  id: string;
  label: string;
  text: string;
  x: number;
  y: number;
  approach: Point;
  className: string;
};

const roomObjects: RoomObject[] = [
  {
    id: "sofa",
    label: "Диван",
    text: "Это просто диван — самый любимый в офисе. Кажется, он помнит все наши дедлайны и перерывы на чай.",
    x: 18,
    y: 35,
    approach: { x: 21, y: 52 },
    className: "sofa",
  },
  {
    id: "aquarium",
    label: "Пиксель",
    text: "Всеми нами любимый черепашка Пиксель. Он по тебе скучает — заезжай к нему почаще.",
    x: 83,
    y: 36,
    approach: { x: 80, y: 54 },
    className: "aquarium",
  },
  {
    id: "machine",
    label: "Автомат с игрушками",
    text: "",
    x: 50,
    y: 42,
    approach: { x: 50, y: 65 },
    className: "machine",
  },
];

const toys = [
  {
    id: "anna-k", name: "Анна", from: "от Анны", revealTitle: "Вот это удача — кажется, мы поймали Анну!", wish: "Твори и вытворяй! Кря",
    image: "/assets/toys/Toy_AnnaK.png", cardImage: "/assets/cards/Letter_AnnaK.png", x: 40, y: 70, rotate: -12,
  },
  {
    id: "anna-v", name: "Анна", from: "от Анны", revealTitle: "Смотри-ка, в клешнях прячется Анна!", wish: "Аля, с твоим днем!!! Ты очень крутая, восхищаюсь тобой, твоим свэгом, талантом, вайбом!!! У тебя очень классное чувство юмора! Всегда хихикаю с твоих стикеров",
    image: "/assets/toys/Toy_AnnaV.png", cardImage: "/assets/cards/Letter_AnnaV.png", x: 50, y: 65, rotate: 9,
  },
  {
    id: "dima", name: "Дима", from: "от Димы", revealTitle: "Ура! Кажется, к нам попался Дима!", wish: "С дршкой, бро, счастья, здоровья, здоровья, счастья :):):):):)",
    image: "/assets/toys/Toy_Dima.png", cardImage: "/assets/cards/Letter_Dima.png", x: 60, y: 71, rotate: -7,
  },
  {
    id: "dima-h", name: "Дима", from: "от Димы", revealTitle: "Ого, автомат подарил нам Диму!", wish: "Аля! С днем рождения! Сияй и светись!",
    image: "/assets/toys/Toy_DimaH.png", cardImage: "/assets/cards/Letter_DimaH.png", x: 70, y: 64, rotate: 8,
  },
  {
    id: "lera", name: "Лера", from: "от Леры", revealTitle: "Есть! Кажется, мы выловили Леру!", wish: "Ты замечательный человечек с золотыми руками. Желаю тебе безграничного счастья и нескончаемой удачи. пусть здоровье будет крепким как алмаз! и все получается!",
    image: "/assets/toys/Toy_Lera.png", cardImage: "/assets/cards/Letter_Lera.png", x: 80, y: 71, rotate: -9,
  },
  {
    id: "lera-v", name: "Лера", from: "от Леры", revealTitle: "Вот это находка — это же Лера!", wish: "Аля! С днем рождения!!! Была безумно рада познакомиться с тобой вживую на корпоративе. Оставайся такой же хайпушной, не болей, реализуй все свои творческие идеи и обязательно вкусно кушай и отдыхай. С теплыми чувствами, Валееееерая",
    image: "/assets/toys/Toy_LeraV.png", cardImage: "/assets/cards/Letter_LeraV.png", x: 88, y: 63, rotate: 11,
  },
  {
    id: "liza", name: "Лиза", from: "от Лизы", revealTitle: "Ого, кажется, мы поймали Лизу!", wish: "С ДР! Побольше классных проектов и вкусной еды",
    image: "/assets/toys/Toy_Liza.png", cardImage: "/assets/cards/Letter_Liza.png", x: 45, y: 82, rotate: 7,
  },
  {
    id: "public", name: "Паблик", from: "от Паблика", revealTitle: "Ничего себе! Пойман целый Паблик!", wish: "Дорогая Альбина, с днем рождения! Любим тебя сквозь города, твой PUBLICART!",
    image: "/assets/toys/Toy_Public.png", cardImage: "/assets/cards/Letter_Public.png", x: 57, y: 80, rotate: -10,
  },
  {
    id: "slava", name: "Слава", from: "от Славы", revealTitle: "Ура, кран поймал Славу!", wish: "Альбина, поздравляю тебя с Днем рождения! Желаю всего самого лучшего: радостных моментов в жизни, здоровья тебе и твоим близким, столько $, чтобы осуществить все материальные желания :)",
    image: "/assets/toys/Toy_Slava.png", cardImage: "/assets/cards/Letter_Slava.png", x: 72, y: 82, rotate: 6,
  },
  {
    id: "tama", name: "Тама", from: "от Тамы", revealTitle: "Вот это да — кажется, мы нашли Таму!", wish: "С днем рождения! Счастья, любви и благополучия!",
    image: "/assets/toys/Toy_Tama.png", cardImage: "/assets/cards/Letter_Tama.png", x: 85, y: 80, rotate: -6,
  },
];

const finalLetterText = "Дорогая Альбина! С днем рождения! Ценю твой профессионализм, адекватность и неравнодушие! У тебя есть все необходимые качества для стремительного роста, так что уверен, что ты достигнешь всего, чего только захочешь! Желаю лишь, чтобы ты достигла этого как можно скорее) Крепкого здоровья тебе и твоим близким. Кирилл";

export default function Home() {
  const [view, setView] = useState<"room" | "machine">("room");
  const [position, setPosition] = useState<Point>({ x: 35, y: 76 });
  const [walking, setWalking] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; text: string } | null>(null);
  const [deliveredIds, setDeliveredIds] = useState<string[]>([]);
  const [revealToyId, setRevealToyId] = useState<string | null>(null);
  const [cardToyId, setCardToyId] = useState<string | null>(null);
  const [finalLetterStage, setFinalLetterStage] = useState<"envelope" | "letter" | null>(null);
  const [finalLetterCompleted, setFinalLetterCompleted] = useState(false);
  const [craneX, setCraneX] = useState(70);
  const [craneStage, setCraneStage] = useState<"idle" | "descending" | "lifting" | "carrying" | "dropping">("idle");
  const [capturedToyId, setCapturedToyId] = useState<string | null>(null);
  const [gameMessage, setGameMessage] = useState("Поставьте кран над игрушкой и нажмите «Схватить»");

  const floorRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef(new Set<string>());
  const targetRef = useRef<Point | null>(null);
  const pendingInteractionRef = useRef<string | null>(null);
  const interactRef = useRef<(id: string) => void>(() => undefined);
  const timersRef = useRef<number[]>([]);
  const craneDirectionRef = useRef(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("office-card-toys");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const validIds = Array.isArray(parsed)
          ? parsed.filter((id): id is string => typeof id === "string" && toys.some((toy) => toy.id === id))
          : [];
        setDeliveredIds(validIds);
      } catch {
        window.localStorage.removeItem("office-card-toys");
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("office-card-toys", JSON.stringify(deliveredIds));
  }, [deliveredIds]);

  const interactWith = useCallback((id: string) => {
    const object = roomObjects.find((item) => item.id === id);
    if (!object) return;
    if (id === "machine") {
      setDialog(null);
      setView("machine");
      setGameMessage(
        deliveredIds.length === toys.length
          ? "Все пожелания уже собраны. Игрушки ждут вас в комнате!"
          : "Поставьте кран над игрушкой и нажмите «Схватить»",
      );
      return;
    }
    setDialog({ title: object.label, text: object.text });
  }, [deliveredIds.length]);

  interactRef.current = interactWith;

  const nearestObject = useMemo(() => {
    const nearest = roomObjects
      .map((object) => ({
        object,
        distance: Math.hypot(position.x - object.approach.x, position.y - object.approach.y),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
    return nearest && nearest.distance < 10 ? nearest.object : null;
  }, [position]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        event.preventDefault();
        keysRef.current.add(key);
        targetRef.current = null;
        pendingInteractionRef.current = null;
      }
      if ((key === "e" || key === "enter") && view === "room" && nearestObject && !dialog) {
        event.preventDefault();
        interactWith(nearestObject.id);
      }
      if (key === "escape") {
        if (finalLetterStage === "letter") setFinalLetterStage(null);
        else if (cardToyId) setCardToyId(null);
        else if (revealToyId) {
          const shouldRevealFinalLetter = deliveredIds.length === toys.length && !finalLetterCompleted;
          setRevealToyId(null);
          setView("room");
          if (shouldRevealFinalLetter) {
            setFinalLetterCompleted(true);
            const letterTimer = window.setTimeout(() => setFinalLetterStage("envelope"), 220);
            timersRef.current.push(letterTimer);
          }
        } else if (dialog) setDialog(null);
        else if (view === "machine") setView("room");
      }
    };
    const onKeyUp = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [cardToyId, deliveredIds.length, dialog, finalLetterCompleted, finalLetterStage, interactWith, nearestObject, revealToyId, view]);

  useEffect(() => {
    if (view !== "room" || dialog || revealToyId || finalLetterStage) {
      setWalking(false);
      return;
    }
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 16.67, 2);
      previous = now;
      setPosition((current) => {
        let dx = 0;
        let dy = 0;
        const keys = keysRef.current;
        if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
        if (keys.has("arrowright") || keys.has("d")) dx += 1;
        if (keys.has("arrowup") || keys.has("w")) dy -= 1;
        if (keys.has("arrowdown") || keys.has("s")) dy += 1;

        const target = targetRef.current;
        if (!dx && !dy && target) {
          const distance = Math.hypot(target.x - current.x, target.y - current.y);
          if (distance < 1.25) {
            targetRef.current = null;
            setWalking(false);
            const pending = pendingInteractionRef.current;
            pendingInteractionRef.current = null;
            if (pending) window.setTimeout(() => interactRef.current(pending), 80);
            return current;
          }
          dx = (target.x - current.x) / distance;
          dy = (target.y - current.y) / distance;
        }

        if (!dx && !dy) {
          setWalking(false);
          return current;
        }

        const length = Math.hypot(dx, dy) || 1;
        dx /= length;
        dy /= length;
        setWalking(true);
        return {
          x: Math.max(7, Math.min(93, current.x + dx * 0.55 * delta)),
          y: Math.max(29, Math.min(88, current.y + dy * 0.55 * delta)),
        };
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dialog, finalLetterStage, revealToyId, view]);

  useEffect(() => () => timersRef.current.forEach((timer) => window.clearTimeout(timer)), []);

  const walkToObject = (event: React.PointerEvent, object: RoomObject) => {
    event.stopPropagation();
    if (view !== "room" || dialog) return;
    targetRef.current = object.approach;
    pendingInteractionRef.current = object.id;
  };

  const moveToPoint = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!floorRef.current || dialog) return;
    const bounds = floorRef.current.getBoundingClientRect();
    targetRef.current = {
      x: Math.max(7, Math.min(93, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.max(29, Math.min(88, ((event.clientY - bounds.top) / bounds.height) * 100)),
    };
    pendingInteractionRef.current = null;
  };

  const shiftCrane = (amount: number) => {
    if (craneStage !== "idle") return;
    setCraneX((value) => Math.max(34, Math.min(88, value + amount)));
  };

  const startCraneMove = (event: React.PointerEvent<HTMLButtonElement>, direction: number) => {
    if (craneStage !== "idle") return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    craneDirectionRef.current = direction;
  };

  const stopCraneMove = () => {
    craneDirectionRef.current = 0;
  };

  useEffect(() => {
    if (view !== "machine" || craneStage !== "idle") {
      craneDirectionRef.current = 0;
      return;
    }
    let frame = 0;
    let previous = performance.now();
    const move = (now: number) => {
      const delta = Math.min((now - previous) / 16.67, 2);
      previous = now;
      const direction = craneDirectionRef.current;
      if (direction) {
        setCraneX((value) => Math.max(34, Math.min(88, value + direction * 0.34 * delta)));
      }
      frame = requestAnimationFrame(move);
    };
    frame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(frame);
  }, [craneStage, view]);

  const grabToy = () => {
    if (craneStage !== "idle") return;
    const available = toys.filter((toy) => !deliveredIds.includes(toy.id));
    const candidate = available
      .map((toy) => ({ toy, distance: Math.abs(toy.x - craneX) }))
      .sort((a, b) => a.distance - b.distance)[0];

    setCraneStage("descending");
    setGameMessage("Кран опускается…");
    const descendTimer = window.setTimeout(() => {
      if (!candidate || candidate.distance > 8.5) {
        setGameMessage("Почти! Подвиньте кран точнее и попробуйте ещё раз.");
        setCraneStage("idle");
        return;
      }
      setCapturedToyId(candidate.toy.id);
      setCraneStage("lifting");
      setGameMessage(`Есть! Поднимаем ${candidate.toy.name}…`);

      const liftTimer = window.setTimeout(() => {
        setCraneStage("carrying");
        setCraneX(16.5);
        setGameMessage(`${candidate.toy.name} едет к лотку…`);

        const carryTimer = window.setTimeout(() => {
          setCraneStage("dropping");
          setGameMessage("Почти готово — игрушка падает в призовой лоток!");

          const dropTimer = window.setTimeout(() => {
            setDeliveredIds((current) => current.includes(candidate.toy.id) ? current : [...current, candidate.toy.id]);
            setCapturedToyId(null);
            setCraneStage("idle");
            setCraneX(48);
            setRevealToyId(candidate.toy.id);
          }, 360);
          timersRef.current.push(dropTimer);
        }, 650);
        timersRef.current.push(carryTimer);
      }, 420);
      timersRef.current.push(liftTimer);
    }, 560);
    timersRef.current.push(descendTimer);
  };

  const closeToyReveal = () => {
    const shouldRevealFinalLetter = deliveredIds.length === toys.length && !finalLetterCompleted;
    setRevealToyId(null);
    setCardToyId(null);
    setView("room");
    setPosition({ x: 50, y: 69 });
    if (shouldRevealFinalLetter) {
      setFinalLetterCompleted(true);
      const letterTimer = window.setTimeout(() => setFinalLetterStage("envelope"), 220);
      timersRef.current.push(letterTimer);
    }
  };

  const resetProgress = () => {
    setDeliveredIds([]);
    setRevealToyId(null);
    setCardToyId(null);
    setFinalLetterStage(null);
    setFinalLetterCompleted(false);
    setCraneX(70);
    setCraneStage("idle");
    setGameMessage("Поставьте кран над игрушкой и нажмите «Схватить»");
  };

  const revealedToy = toys.find((toy) => toy.id === revealToyId) ?? null;
  const cardToy = toys.find((toy) => toy.id === cardToyId) ?? null;

  return (
    <main className="game-shell">
      <section className="game-frame" aria-label={view === "room" ? "Интерактивная офисная комната" : "Игра с автоматом"}>
        <div className="game-toolbar">
          <span className="progress-chip" aria-live="polite">
            <span>★</span> Собрано {deliveredIds.length}/{toys.length}
          </span>
          {deliveredIds.length > 0 && (
            <button className="text-button" onClick={resetProgress}>Начать заново</button>
          )}
        </div>
        {view === "room" ? (
          <div className="room" ref={floorRef} onPointerDown={moveToPoint}>
            <div className="back-wall">
              <div className="window window-left"><span /><span /><span /></div>
              <div className="window window-right"><span /><span /><span /></div>
              <div className="wall-line" />
            </div>
            <div className="room-floor-grid" />

            {roomObjects.map((object) => (
              <button
                key={object.id}
                className={`room-object ${object.className}`}
                style={{
                  left: `${object.x}%`,
                  top: `${object.y}%`,
                  zIndex: Math.round((object.y + (object.id === "machine" ? 18 : 13)) * 10),
                }}
                onPointerDown={(event) => walkToObject(event, object)}
                aria-label={`${object.label}. Нажмите, чтобы подойти`}
              >
                <span className="object-art" aria-hidden="true">
                  {object.id === "sofa" && <img src="/assets/room/office-sofa.png" alt="" draggable={false} />}
                  {object.id === "aquarium" && <img src="/assets/room/pixel-aquarium.png" alt="" draggable={false} />}
                  {object.id === "machine" && (
                    <>
                      <span className="machine-sign">ПРИЗ</span>
                      <span className="machine-glass">
                        <img src="/assets/toys/Toy_DimaH.png" alt="" width="700" height="900" draggable={false} />
                      </span>
                      <span className="machine-panel">●　＋</span>
                    </>
                  )}
                </span>
                <span className="object-label">{object.label}</span>
              </button>
            ))}

            {deliveredIds.map((id, index) => {
              const toy = toys.find((item) => item.id === id)!;
              const column = index % 5;
              const row = Math.floor(index / 5);
              const toyX = 15 + column * 17.5 + row * 6;
              const toyY = 70 + row * 13;
              return (
                <button
                  key={id}
                  className="collected-toy"
                  style={{ left: `${toyX}%`, top: `${toyY}%`, zIndex: Math.round(toyY * 10) }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    setRevealToyId(id);
                  }}
                  aria-label={`Открыть пожелание: ${toy.name}`}
                >
                  <img src={toy.image} alt="" width="700" height="900" draggable={false} />
                  <small>{toy.name}</small>
                </button>
              );
            })}

            <div
              className={`player ${walking ? "is-walking" : ""}`}
              style={{ left: `${position.x}%`, top: `${position.y}%`, zIndex: Math.round(position.y * 10) }}
              aria-label="Игровой персонаж"
            >
              <span className="player-shadow" />
              <img className="player-sprite player-idle" src="/assets/player/idle.png" alt="" width="512" height="512" draggable={false} />
              <img className="player-sprite player-walk player-walk-one" src="/assets/player/walk-1.png" alt="" width="512" height="512" draggable={false} />
              <img className="player-sprite player-walk player-walk-two" src="/assets/player/walk-2.png" alt="" width="512" height="512" draggable={false} />
            </div>

            <div className="movement-tip">
              для перемещения используй мышку или тап по экрану
            </div>
          </div>
        ) : (
          <div className="claw-game">
            <button className="back-button" onClick={() => setView("room")} aria-label="Вернуться в комнату">← В комнату</button>
            <div className="cabinet-game">
              <div className="cabinet-top">GOOD THINGS INSIDE</div>
              <div className="glass-field">
                <div className="rail" />
                <div
                  className={`crane ${craneStage}`}
                  style={{ left: `${craneX}%` }}
                  aria-hidden="true"
                >
                  <span className="cable" />
                  <span className="claw-head" />
                  <span className="claw-arm left" />
                  <span className="claw-arm right" />
                </div>
                <div className="prize-chute">
                  <span>ПРИЗ</span>
                </div>
                <div className="toy-pile" />
                {toys.map((toy) => {
                  if (deliveredIds.includes(toy.id)) return null;
                  const carried = capturedToyId === toy.id;
                  return (
                    <div
                      key={toy.id}
                      className={`machine-toy ${carried ? `is-carried is-${craneStage}` : ""}`}
                      style={{
                        left: `${carried ? craneX : toy.x}%`,
                        top: `${carried ? craneStage === "dropping" ? 83 : craneStage === "lifting" ? 38 : 30 : toy.y}%`,
                        transform: `translate(-50%, -50%) rotate(${carried ? 0 : toy.rotate}deg)`,
                      }}
                    >
                      <img src={toy.image} alt="" width="700" height="900" draggable={false} />
                    </div>
                  );
                })}
              </div>
              <div className="control-panel">
                <div className="control-copy">
                  <strong>{gameMessage}</strong>
                  <span>Удерживайте стрелку, чтобы двигать кран</span>
                </div>
                <div className="controls" aria-label="Управление краном">
                  <button
                    onClick={() => shiftCrane(-1.5)}
                    onPointerDown={(event) => startCraneMove(event, -1)}
                    onPointerUp={stopCraneMove}
                    onPointerCancel={stopCraneMove}
                    onLostPointerCapture={stopCraneMove}
                    disabled={craneStage !== "idle"}
                    aria-label="Удерживайте, чтобы двигать кран влево"
                  >←</button>
                  <button onClick={grabToy} disabled={craneStage !== "idle" || deliveredIds.length === toys.length} className="grab-button">
                    Схватить
                  </button>
                  <button
                    onClick={() => shiftCrane(1.5)}
                    onPointerDown={(event) => startCraneMove(event, 1)}
                    onPointerUp={stopCraneMove}
                    onPointerCancel={stopCraneMove}
                    onLostPointerCapture={stopCraneMove}
                    disabled={craneStage !== "idle"}
                    aria-label="Удерживайте, чтобы двигать кран вправо"
                  >→</button>
                </div>
                <div className="coin-slot">●</div>
              </div>
            </div>
          </div>
        )}

        {dialog && (
          <div className="dialog-box" role="dialog" aria-live="polite">
            <div>
              <strong>{dialog.title}</strong>
              <p>{dialog.text}</p>
            </div>
            <button onClick={() => setDialog(null)} aria-label="Закрыть диалог">×</button>
          </div>
        )}

        {revealedToy && (
          <div className="reveal-overlay" role="dialog" aria-modal="true" aria-labelledby="toy-title">
            <button className="overlay-close" onClick={closeToyReveal} aria-label="Убрать игрушку в комнату">×</button>
            <div className="reveal-copy">
              <h2 id="toy-title">{revealedToy.revealTitle}</h2>
              <p>Нажми на неё, чтобы посмотреть, что она тебе пожелала</p>
            </div>
            <button className="featured-toy" onClick={() => setCardToyId(revealedToy.id)} aria-label="Открыть открытку">
              <span className="featured-toy-art">
                <img src={revealedToy.image} alt="" width="700" height="900" draggable={false} />
              </span>
            </button>
          </div>
        )}

        {cardToy && (
          <div className="card-overlay" role="dialog" aria-modal="true" aria-label={`Открытка ${cardToy.from}`}>
            <button className="overlay-close" onClick={() => setCardToyId(null)} aria-label="Закрыть открытку">×</button>
            <div className="card-presentation">
              <img className="real-card" src={cardToy.cardImage} alt={`Открытка ${cardToy.from}`} width="1800" height="1800" draggable={false} />
              <p>{cardToy.wish}</p>
            </div>
          </div>
        )}

        {finalLetterStage === "envelope" && (
          <div className="final-letter-overlay" role="dialog" aria-modal="true" aria-labelledby="final-envelope-title">
            <div className="final-envelope-copy">
              <h2 id="final-envelope-title">Ой, кажется тут еще одно письмо.</h2>
              <p>Нажми на него чтобы открыть!</p>
            </div>
            <button className="final-envelope-button" onClick={() => setFinalLetterStage("letter")} aria-label="Открыть последнее письмо">
              <span className="final-envelope" aria-hidden="true"><i /></span>
            </button>
          </div>
        )}

        {finalLetterStage === "letter" && (
          <div className="final-letter-overlay final-letter-open" role="dialog" aria-modal="true" aria-label="Последнее поздравление">
            <button className="overlay-close" onClick={() => setFinalLetterStage(null)} aria-label="Закрыть последнее письмо">×</button>
            <article className="final-letter-paper">
              <p>{finalLetterText}</p>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}
