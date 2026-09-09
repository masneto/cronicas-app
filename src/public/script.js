const songs = [
  { id: "9a3cd9ef-bbc6-4a0b-80ad-7e21fd1e7217", title: "CNV LO-FI" },
  { id: "f3efb3ff-d999-4604-83c4-318fe97975b8", title: "CNV LO-FI" },
  { id: "1717289c-3793-4b1e-b283-57d23e274628", title: "CNV INTRO 2" },
  { id: "8fbd2ee3-0bdf-4d89-9985-7e87342fa17b", title: "CNV INTRO 3" },
  { id: "295b0222-e301-49e7-9b6c-8e288fc4a674", title: "CNV TDBB 124*" },
  { id: "4733e9b5-57d5-4e3a-90f9-1151827e8237", title: "CNV DET 144*" },
  { id: "dd712acc-e08f-40c8-a87c-487218890cb8", title: "CNV MSTBBG 144*" },
  { id: "58104e50-de45-4a7d-83d9-67e089757511", title: "CNV TDE 122*" },
  { id: "154a5244-5d41-4513-a2b2-36573c74a909", title: "CNV UE 154*" },
  { id: "aa3be1b0-4639-41c3-b169-7fea446d09da", title: "CNV DET 242*" },
  { id: "a8c4edec-8198-4435-b944-70e28969e4c4", title: "CNV DET1" },
  { id: "7c2a78f6-48ab-469f-9cf5-d7c38c188591", title: "CNV KPOP 200*" },
  { id: "ca5fbac1-e10f-407a-a2cf-6e0ee290b1ce", title: "CNV KPOP 139*" },
  { id: "9750a7ad-544e-44c8-b5d6-6e8e174d2622", title: "CNV PISADINHA 251" },
  { id: "ce98f9d0-af2c-47ab-9dc8-425ce3678fe9", title: "CNV PISADINHA 205" },
  { id: "98216740-a4b6-4fe9-91fd-3a8b9261a909", title: "CNV PISADINHA 240" },
  { id: "224c126e-d898-42b5-b637-28a4cc9ffda3", title: "CNV PISADINHA 259" },
  { id: "c45be741-e953-4a09-a303-9711703be971", title: "Clutch Nada Ver 3" },
  { id: "2a8dad68-ad7e-41e3-b4e5-531b2ed09281", title: "Clutch Nada Ver" },
  { id: "e9e9fd1f-0e67-4de2-bd8c-77268b81cd9e", title: "Clutch Nada Ver" },
  { id: "42940feb-81ed-4a7d-986b-ba2c5f219b1d", title: "Clutch Nada Ver" },
  { id: "630405ac-a00e-4cfb-812b-a7564e072dab", title: "Crônicas do Nada Ver" },
  { id: "d7ef8791-5528-4c5b-88a1-89c7d60671e8", title: "Crônicas do Nada Ver" },
  { id: "5bbd8c84-0c46-4035-b5f3-d94dcf1d80d2", title: "Clutch Nada Ver" },
];

const playerStage = document.getElementById('playerStage');
const player = document.getElementById('musicPlayer');

let currentSongIndex = 0;
let loadedSongId = null;

function renderPlaylist() {
  const list = document.getElementById('playlist');
  list.innerHTML = '';
  songs.forEach((song, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'playlist-item' + (i === currentSongIndex ? ' active' : '');
    item.onclick = () => playSong(i);

    const num = document.createElement('span');
    num.className = 'playlist-num';
    if (i === currentSongIndex) {
      const img = document.createElement('img');
      img.src = './images/cnv-logo.webp';
      img.alt = '';
      img.width = 28;
      img.height = 28;
      num.appendChild(img);
    } else {
      num.textContent = i + 1;
    }

    const label = document.createElement('span');
    label.className = 'playlist-label';
    label.textContent = (i + 1) + ' - ' + song.title;

    item.appendChild(num);
    item.appendChild(label);
    list.appendChild(item);
  });
}

function playSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  if (loadedSongId !== song.id) {
    loadedSongId = song.id;
    player.src = 'https://suno.com/embed/' + song.id;
  }
  playerStage.classList.add('playing');
  renderPlaylist();
  const activeItem = document.querySelector('.playlist-item.active');
  if (activeItem) activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

document.getElementById('prevBtn').addEventListener('click', () => {
  playSong((currentSongIndex - 1 + songs.length) % songs.length);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  playSong((currentSongIndex + 1) % songs.length);
});

document.getElementById('reloadBtn').addEventListener('click', () => location.reload());

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', function () {
  document.body.classList.toggle('dark-theme');
  this.textContent = document.body.classList.contains('dark-theme') ? '🌙' : '🌞';
});

renderPlaylist();