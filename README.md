### 🖼️ Frontend (Vue 3 + Chart.js + Vite)

#### 🤖 System requirements

- **Node.js** (empfohlen: ≥ 18.x, LTS-Version empfohlen)
- **npm** (wird automatisch mit Node.js installiert)

#### 🎁 Enthaltene Pakete

| Paket                        | Beschreibung                          |
|-----------------------------|---------------------------------------|
| `vue`                       | Vue 3 Framework                       |
| `vue-router`                | Routing            |
| `axios`                     | HTTP-Client für API-Requests          |
| `chart.js`                  | Diagramm-Rendering-Engine             |
| `vue-chartjs`               | Vue-Wrapper für Chart.js              |
| `chartjs-adapter-date-fns` | für Zeitachsen in Chart.js     |
| `recharts`                  | Weitere Diagramme                     |
| `@vitejs/plugin-vue`        | Plugin zur Integration von Vue in Vite |
| `vite`                      | Build- & Dev-Tool                     |
| `vitest`, `jsdom`, `@vue/test-utils` | Tools für Tests                       |

#### 👹 Frontend Setup

```bash
# 1. Node.js installieren (über https://nodejs.org)
# 2. Ins Frontend-Verzeichnis wechseln

# 3. Abhängigkeiten installieren
npm install

# 4. In .env Backend als Datenquelle angeben (Standard-Port: 8080)

# 5. Dev-Server starten
npm run dev
```