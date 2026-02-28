import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

interface ChronosEvent {
  id: string;
  titleRu: string;
  descriptionRu?: string;
  jdnStart: number;
  era?: { nameRu: string; colorHex: string };
}

function jdnToDate(jdn: number): string {
  const d = new Date((jdn - 2440588) * 86400000);
  return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Home() {
  const [events, setEvents] = useState<ChronosEvent[]>([]);
  const [eras, setEras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('2026-01-01');
  const [jdn, setJdn] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/events`).then(r => r.ok ? r.json() : { events: [] }),
      fetch(`${API_BASE}/eras`).then(r => r.ok ? r.json() : []),
    ]).then(([evData, eraData]) => {
      setEvents(evData.events || []);
      setEras(Array.isArray(eraData) ? eraData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function convertDate() {
    try {
      const r = await fetch(`${API_BASE}/calendar/convert?date=${date}&calendar_type=gregorian`);
      const d = await r.json();
      setJdn(d.jdn);
    } catch {
      setJdn(-1);
    }
  }

  return (
    <div className="container">
      <h1>⏳ Chronos</h1>
      <p className="subtitle">Платформа исторической хронологии с астрономическим движком</p>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{loading ? '…' : events.length}</div>
          <div className="stat-label">Событий</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{loading ? '…' : eras.length}</div>
          <div className="stat-label">Эпох</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">±10к</div>
          <div className="stat-label">Лет диапазон</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">JDN</div>
          <div className="stat-label">Астрономический движок</div>
        </div>
      </div>

      <div className="converter">
        <h2>🗓 Конвертер дат</h2>
        <div className="input-row">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <button onClick={convertDate}>Конвертировать в JDN</button>
        </div>
        {jdn !== null && (
          <div className="result-box">
            {jdn === -1 ? '⚠️ Ошибка конвертации' : `JDN = ${jdn.toLocaleString()}`}
          </div>
        )}
      </div>

      <h2 style={{fontSize:'1.3rem', marginBottom:'1.5rem', color:'#e2e8f0'}}>📅 Таймлайн событий</h2>
      {loading && <p style={{color:'#718096'}}>Загрузка…</p>}
      {!loading && events.length === 0 && (
        <div style={{textAlign:'center', padding:'3rem', color:'#4a5568'}}>
          <div style={{fontSize:'3rem', marginBottom:'1rem'}}>📭</div>
          <p>База событий пуста. Скоро здесь появятся исторические данные из Wikidata.</p>
        </div>
      )}
      <div className="timeline">
        {events.map(ev => (
          <div className="event-card" key={ev.id}>
            {ev.era && (
              <span className="era-badge" style={{background: ev.era.colorHex + '33', color: ev.era.colorHex}}>
                {ev.era.nameRu}
              </span>
            )}
            <div className="event-date">{jdnToDate(ev.jdnStart)}</div>
            <div className="event-title">{ev.titleRu}</div>
            {ev.descriptionRu && <div className="event-desc">{ev.descriptionRu}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
