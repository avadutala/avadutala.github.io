# Vidya Sagar Avadutala — personal website

Refined static website for the existing avadutala.github.io GitHub Pages repository. This version brings original animated illustrations to every main page, including the reading room, cinema, interactive travel atlas, engineering portfolio, Music, Interests, Contact, and the custom missing-page screen.

## Pages

- index.html — home, with a clear professional introduction, a mountain biker riding the trail, a spinning gramophone record beside the Ilaiyaraaja feature, and a tennis rally.
- interests.html — a mountain biker following the trail and a tennis rally, plus other interests.
- movies.html — a working film-projector illustration, the Odyssey feature and all 22 previous films, each with original title artwork, plus gallery/journal views, search, theme filters, sorting, and a reading dialog.
- places.html — an animated globe and aeroplane beside an interactive world map, 22 places visited or lived in, six wishlist destinations, and the complete travel notebook.
- engineering.html — an animated conceptual structural frame, the current SyberJet role, expertise areas, an expandable career timeline, two public engineering stories, and the master’s thesis.
- books.html — an open book with a turning paper leaf, 15 illustrated works, a Project Hail Mary spotlight, fuller book introductions, reading questions, searchable themes, Shelf/Reading notes views, and an interactive reader.
- music.html — a slowly turning record and a personal tribute to Ilaiyaraaja, with reflections on love, passion, creativity, sorrow, and happiness, plus a link to his official music page.
- contact.html — a note gently lifting from its envelope, beside the email and LinkedIn details.
- 404.html — a mountain biker on a custom missing-page screen with links back to Home, Music, and Contact.
- about.html, experience.html, projects.html, blog.html, notes.html — redirects preserving existing URLs; Notes and Blog now lead directly to Music.

## Preview

Extract the archive and open index.html in a current browser. The site does not require a build step, package installation, API key, or internet connection for its layout, illustrations, map, navigation, or movie, book, and music reflection controls. External research records and LinkedIn links need network access; email links use the visitor’s email application.

JavaScript enables the interactive controls. Without JavaScript, the navigation, travel entries, movie reflections, and career content remain readable. Career responsibilities use the browser’s native expandable details controls.

## Explore the refinements

### Homepage and continuity

The homepage introduces Vidya’s current role at SyberJet Aircraft in Phoenix, then gives Ilaiyaraaja’s music its own prominent feature. Mountain biking and tennis remain part of the introduction and the outdoor interests section. The full Odyssey feature remains on Movies, with a link from the homepage’s film card.

Music now appears in Interests, Contact, and the shared footer. The page structure has room for personal photographs and more specific memories when Vidya supplies them; no empty placeholder sections have been added.

### Illustrations in motion across the website

- Mountain biking: a helmeted rider follows the sand trail, with turning spokes and linked pedal/leg movement. The wheels follow the same curve used to draw the path. The 22-second scene loops beyond the visible edges.
- Gramophone: a vinyl record makes a gentle eight-second revolution on an original brass-horn gramophone. The horn, cabinet, and needle remain stationary.
- Tennis: two rackets trade a four-shot, eight-second rally. The ball crosses the net, bounces once on each receiving side, and returns from the racket. The court and net keep their corrected proportions; the ball’s height and size are illustrative.

- Books: an open paper leaf rises, turns across the spine, and settles on the other side. Abstract printed lines move with the page; the actual book notes remain still and readable.
- Movies: two projector reels rotate at different speeds while film perforations pass through the machine. The projection beam stays steady.
- Engineering: load arrows and two moving markers bring a conceptual frame to life. This is decorative technical artwork, not a model of a particular aircraft or a presentation of analysis results.
- Places: a small aeroplane follows a decorative orbit around a gently turning globe. The orbit does not imply a travel itinerary. The existing interactive map and its place data are unchanged.
- Music: groove highlights turn around a stationary Ilaiyaraaja label, with two gently floating notes. There is no embedded audio.
- Contact: a note lifts from its envelope and returns, with a drifting paper plane. This illustration does not send messages or add a contact form.
- Interests and the missing-page screen reuse the trail scene; Interests also includes the tennis rally.

Each illustration has a Pause motion / Play motion button. Controls act together on the current page and remember the visitor’s choice across the website when local storage is available, including browser Back navigation. A device preference for reduced motion starts each page with still illustrations; the visitor can deliberately choose Play motion. Scenes also pause when they are outside the viewport or the browser tab is hidden, and resume from their existing positions. The new page illustrations keep their controls in the caption, clear of the artwork on narrow screens.

The artwork is local SVG with a small shared JavaScript controller. It works in an ordinary GitHub Pages site and in a locally opened index.html, without video downloads, audio, third-party animation libraries, or network requests. Without JavaScript, all complete illustrations remain visible and the inactive controls stay hidden.

### Identity and sports illustrations

The selected Option 1 VA monogram is used in every main page header and in the browser favicon. Its geometric mark is supplied as assets/va-monogram.svg, with the inverse icon in assets/favicon.svg.

The animated mountain biker follows the trail with both wheels positioned from the drawn path. Home, Interests, and the missing-page screen share this scene.

The tennis scene is a proportionally scaled overhead SVG that resizes without stretching. The 78-by-36-foot doubles court, 27-foot singles width, service lines 21 feet from the net, and net posts 3 feet beyond each doubles sideline follow [Rule 1 of the ITF Rules of Tennis](https://www.itftennis.com/media/7221/2026-rules-of-tennis-english.pdf). The SVG geometry is documented in assets/tennis-court.svg.

### Places

- Hover over a map pin, or focus it with the keyboard, to preview a place or a group of nearby places.
- Click or tap a pin to keep its memory in the detail panel. For grouped pins, choose a place using the buttons in that panel. Keyboard users can press Enter or Space on a focused pin; Escape dismisses a preview.
- Switch between Places I’ve been, Someday, and All places. Region buttons focus on World, Asia, Europe, or North America.
- Use the plus/minus buttons to zoom, drag the map to pan, and use Reset map view to return to the selected region.
- Use On the map beside a travel entry to locate it. The full notebook provides a text alternative to exploring the map.

The geography is a bundled local SVG derived from the official Natural Earth land boundaries. It makes no runtime requests to a map service and works offline. Attribution, source URLs, and the public-domain terms are included in assets/world-map-attribution.txt. Pins use approximate city coordinates; broader destinations such as Southwest USA and Europe by road use representative points, not exact addresses or an itinerary. Wishlist destinations remain identified separately from places visited.

### Movies

The 22-film collection has individual original SVG title artworks, plus the separate Odyssey feature. Gallery emphasizes the artwork; Journal gives the reflections more space. Search works across film titles, themes, and reflections, theme buttons narrow the collection, and the order control switches between the original collection order and Title A–Z.

Select Read my reflection to open a film’s reading dialog. Previous/Next buttons and the left/right arrow keys move through the currently filtered collection. Escape or the close button returns to the page. The original reflections remain on the page, and Sakhi retains its all-time-favorite description.

### Engineering

The current SyberJet role is highlighted above three areas of expertise. The career timeline preserves the supplied roles, dates, locations, employers, and responsibility descriptions; expand Work & responsibilities to read each full entry. No dates were inferred for earlier roles.

The research section presents two short stories: Bringing road loads into the lab explains the published load-simplification method, and Supporting fuel tanks as a system describes the patented mounting arrangement. Each separates the challenge, documented approach, and credited contribution, with a direct source link. Co-author and co-inventor roles are explicit; the descriptions do not imply sole ownership or measured performance improvements. The master’s thesis follows as the research foundation.

The three public records are:

- [SAE paper: Vector Load Simplified Duty Cycle for Lower Control Arm](https://saemobilus.sae.org/papers/vector-load-simplified-duty-cycle-lower-control-arm-2020-01-1058) — corrected from the earlier 2019 reference to SAE Technical Paper 2020-01-1058, published April 14, 2020; DOI 10.4271/2020-01-1058. Vidya Avadutala is a co-author.
- [Patent: Vehicle fuel storage mounting system](https://patents.google.com/patent/US12145435B2/en) — US12145435B2, granted November 19, 2024; Vidya Sagar Avadutala is a co-inventor.
- [Master’s thesis: Dynamic Analysis of Cracks in Composite Materials](https://www.diva-portal.org/smash/get/diva2:833463/FULLTEXT01.pdf) — Blekinge Institute of Technology, 2005.

The full LinkedIn profile was unavailable during this refinement. The career timeline therefore relies on the supplied website details, with the research records above independently checked. No additional roles, employment dates, performance metrics, or achievements were invented, and this package does not claim to contain a complete LinkedIn export.

### Books

All 15 existing titles are retained, each with its own original SVG title illustration, a fuller introduction, three topic tags, and a reading question. The Project Hail Mary feature preserves the original personal note. The original Why I read text and notebook quote remain as the closing section. The old notebook banner and its caption have been removed at Vidya’s request.

- Switch between Shelf for the visual collection and Reading notes for introductions and questions beside each book.
- Search by title, author, or idea, and combine the search with theme filters. Calculating God appears under both Science fiction and Society & philosophy.
- Sort by the original collection order, title, or author.
- Open book notes for a larger reading view. Previous/Next and the left/right arrow keys browse the visible collection. Escape or the close button returns to the shelf.
- Each introduction includes an About this book link to its publisher, author, or primary-text collection. These introductions describe the books; the reading questions are editorial prompts, not claims about Vidya’s personal opinions. Only the supplied Project Hail Mary reflection is labelled From my notebook.

The Grand Design now credits both Stephen Hawking and Leonard Mlodinow. Complete Works of Swami Vivekananda is treated as a collected work; the shelf count describes 15 works rather than 15 individual physical volumes. All new introductions and illustrations remain available offline, while the external source links need an internet connection.

### Music

Music replaces the former Notes page in the navigation and on the homepage. It is devoted to Ilaiyaraaja and uses Vidya’s own description of music as a lifelong companion and a source of love, passion, and creativity through sorrow and happiness.

The page includes an original record-inspired illustration and short personal reflections. The reflections remain readable without JavaScript. A listening link opens [Ilaiyaraaja’s official Music page](https://ilaiyaraajalive.com/music.html); no audio is embedded or played automatically. No favorite tracks, albums, or biographical memories have been inferred.

### Sharing and missing pages

Every main page includes its own title, description, canonical URL, Open Graph URL, and large-image sharing metadata. The shared preview is assets/social-preview.png (1200 × 630 pixels), with an editable source at assets/social-preview.svg. It uses the selected VA monogram and the site’s forest-green and ivory palette. These previews become available to sharing services after the updated files are deployed; existing cached previews may take time to refresh.

GitHub Pages uses the root 404.html file for missing addresses. Its assets and navigation use root-relative paths so they still work for a missing URL several folders deep. Preview this page through a local web server or on the deployed site; opening 404.html directly as a local file does not provide a website root for those paths. See [GitHub’s custom 404 documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).

### Future personal additions

- Photographs: a portrait and a few favorite biking, tennis, or travel pictures. A short caption and location will help place each image naturally.
- Music: five to ten Ilaiyaraaja songs, each with one or two sentences about the memory or feeling attached to it.
- Books: a few sentences about what stayed with Vidya from three to five especially meaningful books.
- Engineering: any additional project context or lessons Vidya chooses to make public. The current stories use the existing public records.

## Update GitHub Pages

1. Keep a backup of the current repository.
2. Extract this archive. Open the extracted folder that contains index.html, style.css, site.js, CNAME, and the assets folder.
3. Upload those files and the assets folder to the root of the existing avadutala.github.io repository on the main branch. Preserve the assets folder; do not add another enclosing project folder inside the repository.
4. Review and commit the changes. Keep Pages configured as Deploy from a branch, main, / (root).
5. Allow the Pages deployment to complete in Actions, then refresh https://www.avadutala.com/.

The existing CNAME is preserved byte-for-byte and contains www.avadutala.com. Hosting settings and DNS changes are not required for these content and design updates.

This update changes all eight main HTML pages, 404.html, and the animation styles and scripts. Upload the complete extracted contents so every page receives its illustration and controls. The shared runtime is now motion.js and motion.css, with story-scenes.js, journey-scenes.js, life-scenes.js, and the three existing home scene scripts. Versioned stylesheet and script links help returning browsers reload this update; keep the supplied filenames. Once deployment succeeds, use Ctrl+F5 if the old appearance is still cached. A leftover home-motion.js from the previous upload is no longer referenced and does not affect the updated site.

## Editing

Edit the HTML files directly. Shared styling lives in style.css; shared navigation behavior lives in site.js. Page-specific presentation and interactions are organized as follows:

- Home: home.css and index.html. The three SVG scenes are embedded directly in index.html so they work with local-file previews. Editable standalone copies are supplied as assets/home-bike-scene.svg, assets/home-gramophone-scene.svg, and assets/home-tennis-scene.svg. If changing the artwork, copy the updated SVG into its corresponding scene in index.html as well.
- Shared motion: motion.js owns playback, pause controls, remembered choices, reduced-motion preference, and visibility handling. motion.css styles the shared controls and animated page layouts. Each page loads only the scene bundle it uses.
- Scene renderers: home-bike.js, home-gramophone.js, and home-tennis.js provide the original three scenes. story-scenes.js provides Books and Movies; journey-scenes.js provides Engineering and Places; life-scenes.js provides Music and Contact. Renderers receive elapsed seconds from the shared controller and do not create their own timers.
- New scene artwork: assets/books-motion-scene.svg, assets/cinema-motion-scene.svg, assets/engineering-motion-scene.svg, assets/travel-motion-scene.svg, assets/music-motion-scene.svg, and assets/contact-motion-scene.svg are the editable sources. Their SVG content is embedded directly in the matching HTML pages so local previews do not depend on fetching files. If an SVG changes, update its embedded copy too.
- Places: travel.css and travel.js. Place data is embedded as JSON in places.html under travel-data; keep it consistent with the visible notebook entries when adding or changing a destination.
- Movies: movies.css and movies.js. Film titles, categories, original collection order, artwork paths, and reflections are in movies.html. The artwork files and title-to-file manifest are in assets/films/.
- Engineering: career.css and engineering.html. The timeline uses native details elements, so it needs no additional script.
- Music: music.css, music.js, and music.html. The personal reflections are in the HTML; the script adds keyboard-accessible selection between them.
- Books: books.css, books.js, and books.html. Book summaries, reading prompts, authors, source links, and theme labels are in the HTML; original artwork and its title-to-file manifest are in assets/books/.
- Missing pages: not-found.css and 404.html. Keep its site links and asset paths root-relative for GitHub Pages.

Keep the assets folder and all linked stylesheets/scripts with the HTML files. No build tool is needed after editing.

## Assets and content

The SVG landscape, animated page scenes, cinema image, record-inspired Music artwork, 22 film title artworks, and 15 book title artworks are original decorative illustrations. They are not photographs of Vidya, official movie posters, an official Odyssey poster, or reproductions of publishers’ book covers. The map geography is attributed separately as described above. The old banner_final_14books.jpg has been removed from this updated website.

Odyssey is presented using the supplied title and personal viewing reaction; no director, cast, release year, rating, or exact runtime has been inferred. Sakhi retains its existing all-time-favorite description. Existing professional details and personal memories are carried over from the supplied website.

The unused hero.jpg and Vidya_Avadutala_Resume.pdf in the source archive contained only placeholder text, so they are excluded from this updated package. The unused nested legacy website archive is also excluded. No existing site page linked to these files.
