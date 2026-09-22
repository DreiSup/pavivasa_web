# 12 · Otros bloques y comportamientos

## 1. `.jobdetail-salary` y sus hijos (`__ico`, `__label`, `__amount`, `__note`)

Aparece en una sola página del espejo: `site/pages/jobs/studentische-assistenz.html:149-156`. La evidencia del hueco menciona "duplicado casi idéntico en la fila jobdetail de sdr-sales.html"; comprobado con `grep -n "jobdetail-salary" site/pages/jobs/sdr-sales.html` → sin resultados. **Corrección**: `sdr-sales.html` no usa este bloque (esa oferta no lleva `baseSalary` en su `JobPosting`, ver 06-plantillas-interiores.md §11.2 tabla JSON-LD). El bloque solo existe en `studentische-assistenz.html`, coherente con el único puesto que sí declara `baseSalary`.

### DOM literal (`studentische-assistenz.html:149-156`)

```html
<div class="jobdetail-salary">
  <span class="jobdetail-salary__ico" aria-hidden="true">💶</span>
  <div>
    <span class="jobdetail-salary__label">Gehalt</span>
    <span class="jobdetail-salary__amount">from € 1.273,50 brutto/Monat</span>
    <span class="jobdetail-salary__note">KV-Mindestgrundgehalt (IT-KV 2026, 50 % der Einstiegsstufe Gruppe AT for Studien-/Ferialpraktikum), Basis Vollzeit 38,5 h – aliquot bei Teilzeit. Überzahlung je nach Qualifikation and Erfahrung.</span>
  </div>
</div>
```

Mecanismo del DOM: `.jobdetail-salary` es `display:flex` con **exactamente dos** hijos directos — `span.jobdetail-salary__ico` y un `<div>` sin clase que envuelve `__label` + `__amount` + `__note`. Ese `<div>` intermedio es lo que hace que `align-items:flex-start` alinee el emoji contra la *primera línea* de una columna de texto que puede ocupar varias líneas (la `__note` es larga), y no contra el centro vertical del bloque completo. Los tres spans internos llevan `display:block` precisamente porque, sin la propiedad, serían `inline` dentro de ese `<div>` y se pegarían en una sola línea. Una implementación que aplane los 4 elementos como hermanos directos de `.jobdetail-salary` (sin el wrapper) rompe el alineado top del icono. El emoji lleva `aria-hidden="true"` (mismo patrón que `.jobcard__ico` en 04-tarjetas.md).

### CSS completo (`main.pretty.css:5812-5844`)

```css
.jobdetail-salary{
  display:flex;
  align-items:flex-start;
  gap:14px;
  background:rgba(26,165,133,.07);
  border:1px solid rgba(26,165,133,.25);
  border-radius:16px;
  padding:20px 22px;
  margin-bottom:34px}
.jobdetail-salary__ico{
  font-size:1.6rem;
  line-height:1;
  flex-shrink:0}
.jobdetail-salary__label{
  display:block;
  font-size:.72rem;
  text-transform:uppercase;
  letter-spacing:.05em;
  color:var(--brand-green-dark);
  font-weight:800;
  margin-bottom:3px}
.jobdetail-salary__amount{
  display:block;
  font-size:1.18rem;
  font-weight:800;
  color:var(--color-title)}
.jobdetail-salary__note{
  display:block;
  margin-top:7px;
  font-size:.86rem;
  color:var(--color-text);
  line-height:1.5;
  max-width:64ch}
```

Notas de valores:
- `background:rgba(26,165,133,.07)` y `border:1px solid rgba(26,165,133,.25)` no son tokens (no hay `var()`); son el mismo verde crudo `26,165,133` que subyace a `--brand-green` (`#1aa585`, ver 01-fundamentos.md), usado aquí en dos pasos de alpha distintos: `.07` para el fondo (tinte casi imperceptible) y `.25` para el borde (contorno visible pero suave). Es el mismo patrón de escala de alpha sobre `rgba(26,165,133,…)` que ya documenta 04-tarjetas.md para `.jobcard-meta__chip--salary` (`rgba(26,165,133,.10)`) — tres puntos de la misma escala (`.07` / `.10` / `.25`) usados según el peso visual que necesita cada elemento.
- `__label` y `__amount` **no** llevan `margin` propio salvo `__label{margin-bottom:3px}`; el espaciado entre `__amount` y `__note` lo pone `__note{margin-top:7px}`.
- `__ico{flex-shrink:0}` evita que el emoji se comprima si `__note` fuerza el contenedor a estrecharse en viewports pequeños.
- `max-width:64ch` en `__note` limita la longitud de línea del texto legal/aclaratorio, igual que otros bloques de prosa del sitio.
- Colores vía token: `--brand-green-dark` (`#12755e`) en `__label`, `--color-title` (`#151719`) en `__amount`, `--color-text` (`#535353`) en `__note` — confirmados en 01-fundamentos.md.

### Estados y breakpoints

Sin `:hover`/`:focus` propios (no es interactivo, es contenido informativo). Comprobado `grep -n 'jobdetail-salary' main.pretty.css` → únicas 6 apariciones son las declaraciones base de arriba (líneas 5812, 5821, 5825, 5833, 5838) más el propio selector padre; y `grep -n '@media' main.pretty.css` en el rango 5400–5900 no incluye ningún override de `.jobdetail-salary` ni de sus hijos — sin overrides en ningún `@media`. El bloque no cambia de layout en responsive; solo se ve afectado indirectamente por el `max-width:980px` de `.container.jobdetail` (06-plantillas-interiores.md §11.2) y por el reflujo natural de `flex` al estrechar el viewport.

### Traducción a Next/Tailwind/shadcn

```tsx
function JobDetailSalary({ amount, note }: { amount: string; note: string }) {
  return (
    <div className="mb-[34px] flex items-start gap-3.5 rounded-2xl border border-[rgba(26,165,133,.25)] bg-[rgba(26,165,133,.07)] px-[22px] py-5">
      <span aria-hidden="true" className="flex-shrink-0 text-[1.6rem] leading-none">💶</span>
      <div>
        <span className="mb-[3px] block text-[.72rem] font-extrabold uppercase tracking-[.05em] text-brand-green-dark">
          Gehalt
        </span>
        <span className="block text-[1.18rem] font-extrabold text-title">{amount}</span>
        <span className="mt-[7px] block max-w-[64ch] text-[.86rem] leading-[1.5] text-body">
          {note}
        </span>
      </div>
    </div>
  );
}
```

No corresponde a ningún componente shadcn de listado (no es `Card` ni `Alert` estándar: el radio `16px`, el padding `20px 22px` y el tinte de un solo color no calzan con los presets de `Alert`); se construye como bloque a medida, opcionalmente envuelto en shadcn `Card` con `className` override si Pavivasa reutiliza el mismo patrón para "precio desde" en fichas de servicio.

---

## 2. `.jobs-value__ico`

Citado solo de nombre en 06-plantillas-interiores.md:604 (`3 × .jobs-value (span.jobs-value__ico emoji, h3, p)`); su CSS no se transcribió en ningún doc 01-10 (`grep -rn 'jobs-value__ico' 01-*.md 02-*.md … 10-*.md` → 0 resultados de declaración, solo la mención de nombre en 06). Aparece en `site/pages/jobs.html:144-147`, dentro de `.jobs-values` (§11.1 de 06-plantillas-interiores.md).

### DOM literal (`jobs.html:145`, uno de los 3 ítems)

```html
<div class="jobs-values">
  <div class="jobs-value">
    <span class="jobs-value__ico" aria-hidden="true">🚀</span>
    <h3>Verantwortung from day 1</h3>
    <p>Flache Hierarchien, direkte Zusammenarbeit with der Geschäftsführung and echte Gestaltungsspielräume statt langer Entscheidungswege.</p>
  </div>
  <!-- + 2 más: 🌍 Flexibel & remote / 📈 Wachsen with uns -->
</div>
```

Los 3 `<span class="jobs-value__ico">` llevan `aria-hidden="true"` (mismo patrón que el resto de emojis-icono del sitio).

### CSS completo (`main.pretty.css:5508-5533`)

```css
.jobs-values{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:22px}
.jobs-value{
  background:var(--color-bg);
  border:1px solid var(--color-border);
  border-radius:18px;
  padding:26px 24px;
  transition:transform .2s,box-shadow .2s}
.jobs-value:hover{
  transform:translateY(-4px);
  box-shadow:0 18px 44px rgba(6,24,39,.10)}
.jobs-value__ico{
  font-size:1.9rem;
  display:block;
  margin-bottom:12px}
.jobs-value h3{
  font-size:1.12rem;
  margin:0 0 8px;
  color:var(--color-title)}
.jobs-value p{
  margin:0;
  color:var(--color-text);
  font-size:.92rem;
  line-height:1.55}
```

`.jobs-value__ico` no lleva color propio (hereda; el emoji ya trae su propio color de glifo). `display:block` + `margin-bottom:12px` lo separa del `h3` como un elemento de bloque independiente, no inline con el título — mismo rol que `.jobs-value__ico` cumple en `.jobcard__ico` (`font-size:2rem;line-height:1`, 04-tarjetas.md) salvo que aquí no lleva `line-height:1` explícito ni participa de ningún `.jobcard__top` con `justify-content:space-between`: en `.jobs-value` el icono está solo, apilado verticalmente encima del título, no junto a un tag lateral.

### Estados y breakpoints

`.jobs-value__ico` no tiene reglas propias en `:hover` (el hover de elevación/sombra lo dispara `.jobs-value:hover`, sobre el contenedor completo, no sobre el icono). En `@media(max-width:900px){ .jobs-values,.jobs-grid{ grid-template-columns:1fr} }` (`main.pretty.css:5782-5784`) la grid de 3 columnas colapsa a 1 columna — afecta al contenedor `.jobs-values`, no cambia el tamaño ni el margen del icono. Sin ningún otro `@media` que toque `.jobs-value__ico` en todo el archivo (`grep -n 'jobs-value__ico' main.pretty.css` → única aparición, la declaración base).

### Traducción a Next/Tailwind/shadcn

```tsx
function JobValueCard({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-border bg-background p-6 px-[24px] py-[26px] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(6,24,39,.10)]">
      <span aria-hidden="true" className="mb-3 block text-[1.9rem]">{icon}</span>
      <h3 className="mb-2 text-[1.12rem] text-title">{title}</h3>
      <p className="text-[.92rem] leading-[1.55] text-body">{children}</p>
    </div>
  );
}
// grid: className="grid grid-cols-3 gap-[22px] max-md:grid-cols-1" (breakpoint ≤900px → Tailwind `md`, umbral por defecto 768px; ajustar con `max-[900px]:grid-cols-1` si se quiere el breakpoint exacto del sitio)
```

Puede montarse sobre shadcn `Card` (`CardContent` con el padding a medida) si Pavivasa reutiliza esta tarjeta de "valor/beneficio" fuera de la sección de empleo (p. ej. en una franja "por qué elegirnos").
