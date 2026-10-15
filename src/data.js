// Everything the page renders lives here, so adding a cover or a video is a one-line change.

export const socials = [
  { name: 'Facebook', handle: 'janino.abrenica', url: 'https://www.facebook.com/janino.abrenica', icon: 'facebook' },
  { name: 'Instagram', handle: '@dodong_janjan', url: 'https://www.instagram.com/dodong_janjan', icon: 'instagram' },
  { name: 'TikTok', handle: '@jninxjanji03', url: 'https://www.tiktok.com/@jninxjanji03', icon: 'tiktok' },
  { name: 'YouTube', handle: '@jnink3176', url: 'https://www.youtube.com/@jnink3176', icon: 'youtube' },
]

export const driveFolderUrl = 'https://drive.google.com/drive/folders/1TgcgThRYAqOIt8iOEs4FH526FrT65kqi'

// Milestones on the staff. `pitch` is the note's height on the staff (0 = bottom line, 8 = top line).
export const timeline = [
  { when: '2022', title: 'First guitar', body: 'Picked up the guitar and never really put it down.', pitch: 1 },
  { when: '2023', title: 'Joined CMME', body: 'Cebu Technological University Moalboal Campus Musical Ensemble.', pitch: 3 },
  { when: 'Choir', title: 'Tenor', body: 'Sang with the ensemble choir and settled into the tenor section.', pitch: 4 },
  { when: 'Bands', title: 'Lead guitar', body: 'Took lead guitar in the ensemble bands, acoustic sets and full band.', pitch: 6 },
  { when: 'Gigs', title: 'Acoustic stages', body: 'Played acoustic gigs backing many different vocalists.', pitch: 5 },
  { when: '2026', title: 'Solo', body: 'Closed out the CMME years. Now it is fingerstyle, between lines of code.', pitch: 7 },
]

// What I play, shown as quick facts in About.
export const roles = [
  { title: 'Lead guitar', body: 'Intros, fills and solos. My usual spot in every band.' },
  { title: 'Acoustic gigs', body: 'One guitar behind one vocalist, for a full set.' },
  { title: 'Choir tenor', body: 'Years in the CMME choir, in the tenor section.' },
  { title: 'Solo fingerstyle', body: 'Melody, bass and rhythm on a single guitar.' },
]

// Photos live in public/photos/. Any file that is missing falls back to a placeholder,
// so you can add them one at a time.
export const photos = {
  hero: '/photos/hero.jpg',
  about: '/photos/about.jpg',
}

// Gallery: add or remove entries freely. `wide` makes a tile span two columns.
// Rows hold 3 columns, so keep (wide x 2 + others) a multiple of 3 to avoid gaps.
export const gallery = [
  { src: '/photos/gallery-1.jpg', alt: 'Playing lead guitar with the band', wide: true },
  { src: '/photos/gallery-2.jpg', alt: 'Acoustic set with a vocalist' },
  { src: '/photos/gallery-3.jpg', alt: 'CMME choir performance' },
  { src: '/photos/gallery-4.jpg', alt: 'Soundcheck before a gig', wide: true },
  { src: '/photos/gallery-5.jpg', alt: 'Full band on stage', wide: true },
  { src: '/photos/gallery-6.jpg', alt: 'Solo fingerstyle at home' },
]

// Booking requests are written up by the form, copied, and sent through Messenger.
export const booking = {
  messengerUrl: 'https://m.me/janino.abrenica',
  eventTypes: ['Acoustic set', 'Lead guitar for a band', 'Event or celebration', 'Something else'],
}

// Recording legend from "Recording Label Classes.txt" in the Drive folder.
export const recordingLabels = {
  'Ear-MB': { source: 'Phone mic', desc: 'Light processing and EQ with a strong volume boost.' },
  'Ear-P': { source: 'Phone mic', desc: 'Light processing and editing at standard levels.' },
  'Ear-V': { source: 'Phone mic', desc: 'V-shaped tone: boosted bass and bright highs.' },
  'DI-Bright': { source: 'Pickup', desc: 'Direct from the pickup, with crisp, shimmering highs.' },
  'DI-Floor': { source: 'Pickup', desc: 'Direct from the pickup, with some audible line noise.' },
  'DI-Fault': { source: 'Pickup', desc: 'The cable or pickup acted up. Cutouts and grit, kept anyway.' },
}

export const covers = [
  { id: '1lYk7itdGmrkvku8IpYoNYGUCZRHYKNz3', title: 'Gitara', artist: 'Parokya ni Edgar', file: 'gitara.mp3', label: 'Ear-P' },
  { id: '1px4Kj-vH7VzPXJTJPhF-aNskqkdP3KpP', title: 'Marilag', artist: 'Dionela', file: 'marilag.mp3', label: 'DI-Bright' },
  { id: '1IL1mUSM2OJKYhKOQDuKWFFdUH9pzZxSU', title: 'Harana', artist: 'Parokya ni Edgar', file: 'harana.mp3', label: 'Ear-V', note: 'Half a semitone up' },
  { id: '1rqG-PiuBC8nyP3-P3G9-Ts0_aQSM4DMn', title: 'Dilaw', artist: 'Maki', file: 'dilaw.mp3', label: 'Ear-MB' },
  { id: '10Kbjz-qGjVYgM4299vzy_k_lX8twINu3', title: 'Palagi', artist: 'TJ Monterde', file: 'palagi.mp3', label: 'DI-Floor' },
  { id: '19Fw2W8cs22hI0VMHEwIUW9l2SvuqLjVS', title: 'At My Worst', artist: 'Pink Sweat$', file: 'at-my-worst.mp3', label: 'Ear-P' },
  { id: '1XMHwZ4RRLjAmSKamiv717EruYuXE4Sm8', title: 'She Will Be Loved', artist: 'Maroon 5', file: 'she-will-be-loved.mp3', label: 'Ear-V' },
  { id: '1_CV_kOV3-f8-2CI7kKws0hh5f86b_gCR', title: "If Ever You're in My Arms Again", artist: 'Peabo Bryson', file: 'if-ever-youre-in-my-arms-again.mp3', label: 'DI-Bright' },
  { id: '1q12OdvYXYLMorHviRDyjVUB_8OTUZuol', title: 'Iniibig Kita', artist: 'Roel Cortez', file: 'iniibig-kita.mp3', label: 'Ear-MB' },
  { id: '1Et-CVrHdSyKmyEWDR4_-lzWDJ8LR2P_i', title: 'Miss Miss', artist: 'Rob Daniel', file: 'miss-miss.mp3', label: 'Ear-P' },
  { id: '1XX1le66K-a-UHY_dbc_XXD_KHA9Mcjfn', title: 'Moment of Truth', artist: 'FM Static', file: 'moment-of-truth.mp3', label: 'Ear-MB' },
  { id: '1H8Yg49W-8uZ1hEfUxyLvNIXt26m4QOTB', title: 'Multo', artist: 'Cup of Joe', file: 'multo.mp3', label: 'DI-Fault' },
]

// Drive blocks cross-site playback (CORP same-site), so the MP3s are copied into public/audio.
export const coverStreamUrl = (file) => `/audio/${file}`
export const coverDriveUrl = (id) => `https://drive.google.com/file/d/${id}/view`

// "Jnin K" productions on YouTube, made in FL Studio Mobile.
export const productions = [
  { id: 'xJSgirQOmpI', title: 'High Steps', credit: 'Jnin K', kind: 'original', year: '2025', style: 'Progressive house' },
  { id: 'hD0q9jb7Ayo', title: 'Rise Up', credit: 'Jnin K', kind: 'original', year: '2024', style: 'Progressive house' },
  { id: 'Y-n4NJMZIkU', title: 'Waiting', credit: 'Jnin K', kind: 'original', year: '2023', style: 'Alan Walker style' },
  { id: 'tSwjqDFaOQE', title: 'Upcoming', credit: 'Jnin K', kind: 'original', style: 'Alan Walker style' },
  { id: 'Jds25BgE0t4', title: 'Release', credit: 'Jnin K', kind: 'original', style: 'Progressive house' },
  { id: 'CHpI2gRHvqU', title: 'Progressive House', credit: 'Jnin K', kind: 'original', style: 'Progressive house' },
  { id: '8mIxavuX6To', title: 'Monster (Jnin K Remix)', credit: 'Meg & Dia', kind: 'remake', style: 'Remix' },
  { id: 'ovPMEu8XmgE', title: 'Nova', credit: 'Ahrix', kind: 'remake', style: 'Remake' },
  { id: 'agR9N1VaWxw', title: 'Heroes Tonight (Instrumental)', credit: 'Janji ft. Johnning', kind: 'remake', style: 'Remake' },
  { id: 'd2b-NMBq8Uk', title: 'The Drums (Bad Reputation Remix)', credit: 'Alan Walker', kind: 'remake', style: 'Remake' },
  { id: 'dpphaDL2bE0', title: 'Sky High Pt. II (Intro and build-up)', credit: 'Elektronomia', kind: 'remake', style: 'Remake' },
  { id: 'IqAoR3AJIfs', title: 'Sing Me to Sleep (Instrumental)', credit: 'Alan Walker', kind: 'remake', style: 'Remake' },
  { id: 'ohPdwexQYfM', title: 'Heroes Tonight (Short)', credit: 'Janji ft. Johnning', kind: 'remake', style: 'Remake' },
]

export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
export const ytEmbed = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
export const ytWatch = (id) => `https://www.youtube.com/watch?v=${id}`
