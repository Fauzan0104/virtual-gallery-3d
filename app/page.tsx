"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Text, Float, Sparkles } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import styles from "./gallery.module.css";

interface Artwork {
  id: string;
  title: string;
  desc: string;
  year: string;
  image: string;
}

interface Room {
  id: number;
  title: string;
  artworks: Artwork[];
}

const rooms: Room[] = [
  { id: 0, title: "Lobby Utama", artworks: [] },
  {
    id: 1,
    title: "Ruangan Foto x Digital Art",
    artworks: [
      { id: "1-1", title: "Metamorfosis Realitas Ruang Jiwa", year: "2026", desc: "Dekonstruksi realitas urban yang monoton melalui intervensi imajinasi surealis, mengubah ruang publik yang kaku menjadi panggung absurditas yang membebaskan", image: "/artworks/room1-1.jpg" },
      { id: "1-2", title: "Kepolosan Masa Fana", year: "2022", desc: "Simbolisasi perjalanan eksistensi manusia yang fana, di mana kepolosan masa kecil dijadikan kompas navigasi melintasi lanskap kedewasaan yang datar", image: "/artworks/room1-2.png" },
      { id: "1-3", title: "Ratap Malam Meniti Pijar Harap", year: "2022", desc: "Bunga Violet menandakan meditasi visual tentang harapan (hope) di tengah malam metafisik, mempertemukan kefanaan alam materiil dengan kerinduan abadi pada cahaya ilahi", image: "/artworks/room1-3.png" },
      { id: "1-4", title: "Lembayung Samudra Niskala", year: "2022", desc: "Perwujudan puitika mimpi (oneiric poetics), mengaburkan batas antara kedalaman samudra batin dan cakrawala senja untuk menyentuh sublime spiritual", image: "/artworks/room1-4.png" },
    ],
  },
  {
    id: 2,
    title: "Ruangan Tradisional x Digital Art",
    artworks: [
      { id: "2-1", title: "Bara Ego di Kedalaman Hampa", year: "2021", desc: "Estetika kehampaan eksistensial Izana, di mana sketsa monokrom melambangkan isolasi dingin dari realitasnya yang terluka. Pendar neon pada mata dan anting-anting menjadi manifestasi will to power, menegaskan bara ambisi seorang raja yang menolak padam di tengah kegelapan takdirnya", image: "/artworks/room2-1.png" },
      { id: "2-2", title: "Mekar Menantang Sunyi Monokrom", year: "2026", desc: "Eksplorasi esensi mentah dari alam (mimesis organik), membuktikan bahwa kekuatan artistik sejati lahir dari tarikan garis sederhana yang menangkap ritme pertumbuhan hidup", image: "/artworks/room2-2.jpg" },
      { id: "2-3", title: "Pendar Lirih Sang Jiwa", year: "2025", desc: "Elegi visual tentang kerapuhan dan keanggunan, menampilkan pendar lembut pada kelopak sebagai metafora jiwa yang tetap memancarkan cinta di tengah kesunyian eksistensial", image: "/artworks/room2-3.jpg" },
      { id: "2-4", title: "Obsesi Sang Iblis", year: "2022", desc: "Enam mata yang menatap nanar merangkum ironi keputusasaan abadi demi mengejar puncak kesempurnaan yang semu. Sorotnya mencerminkan keterbelengguan jiwa dalam rasa iri dan harga diri, menjadikannya monumen keabadian yang sunyi dari kemanusiaan yang hilang", image: "/artworks/room2-4.png" },
    ],
  },
  {
    id: 3,
    title: "Ruangan Lukisan",
    artworks: [
      { id: "3-1", title: "Lolongan Jiwa di Tapal Kesunyian", year: "2022", desc: "Siluet serigala yang melolong pada purnama melambangkan jeritan eksistensial makhluk fana menuju keabadian semesta yang hening. Bayang gelapnya menegaskan keteguhan nurani yang tetap berdiri kokoh menatap hampa di puncak malam", image: "/artworks/room3-1.png" },
      { id: "3-2", title: "Penjaga Sunyi di Puncak Abadi", year: "2021", desc: "Sorot mata tajam bermahkotakan bulan sabit memancarkan harmoni purba antara kebuasan naluri dan kebijaksanaan kosmis. Langkahnya di atas pegunungan beku menjadi metafora perjalanan batin yang menolak tunduk pada kerasnya takdir", image: "/artworks/room3-2.png" },
      { id: "3-3", title: "Sauh Sunyi di Lautan Hening", year: "2026", desc: "Pendar rembulan yang membelah samudra tenang menggambarkan pencarian dermaga spiritual di tengah pengembaraan hidup yang fana. Siluet perahu menjadi saksi kontemplasi diri yang pasrah namun teguh mengarungi samudra waktu", image: "/artworks/room3-3.jpg" },
    ],
  },
  {
    id: 4,
    title: "Ruangan Digital Art",
    artworks: [
      { id: "4-1", title: "Menari di Antara Sunyi Semesta", year: "2024", desc: "Manifestasi pemberontakan eksistensial, di mana batas gravitasi dan realitas kosmik diterobos melalui kebebasan bermain (homo ludens) di tengah kehampaan ruang abadi", image: "/artworks/room4-1.png" },
      { id: "4-2", title: "Tabir Nurani di Balik Kelopak", year: "2022", desc: "Representasi paradoks antara tabir dan pencerahan, mengeksplorasi tatapan mata sebagai jendela jiwa yang mencari kehangatan transendental di balik keheningan diri", image: "/artworks/room4-2.png" },
      { id: "4-3", title: "Dialektika Mitologis: Sura dan Baya", year: "2026", desc: "Batik gaya paisley simbol dari Surabaya refleksi dualisme kosmis dan dialektika mitologis, membingkai konflik abadi antara naluri dan takdir yang terajut harmonis dalam ornamen kehidupan.", image: "/artworks/room4-3.jpeg" },
      { id: "4-4", title: "Terindah yang Terlepas", year: "2024", desc: "Sosok yang pernah membawa rasa jatuh cinta sejatuh-jatuhnya, pada akhirnya menuntun jiwa menuju puncak tertinggi mencintai yaitu ketulusan untuk mengikhlaskan. Kehadiran bunga menegaskan bahwa cinta sejati tidak pernah benar-benar lenyap, melainkan bertransformasi menjadi kenangan abadi di batas cakrawala", image: "/artworks/room4-4.png" },
      { id: "4-5", title: "Es krim 🤤", year: "2026", desc: "Es krim yang mencair mengajarkan bahwa kebahagiaan hidup tak bisa digenggam selamanya, melainkan harus dinikmati seutuhnya sebelum sirna oleh sang waktu", image: "/artworks/room4-5.jpg" },
    ],
  },
  {
    id: 5,
    title: "Ruangan persembahan Karya Terbaik",
    artworks: [
      { id: "5-1", title: "Oline Manuel", year: "Forever", desc: "Karena aku mencintaimu dan hatiku hanya untukmu, Tak akan menyerah dan takkan berhenti mencintaimu, Ku berjuang dalam hidupku, Untuk selalu memilikimu, Seumur hidupku, setulus hatiku Hanya untukmu", image: "/artworks/room5-1.jpg" },
      { id: "5-2", title: "Harusnya", year: "padakno", desc: "Apakah ada kemungkinan dia sadar dok?", image: "/artworks/room5-2.jpg" },
    ],
  },
];

// Komponen Partikel 3D Lobby
function LobbySoulScene() {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[-4, 3, 2]} intensity={50} color="#f59e0b" distance={12} />
      <pointLight position={[4, -3, 2]} intensity={50} color="#3b82f6" distance={12} />
      <pointLight position={[0, 0, -2]} intensity={30} color="#ec4899" distance={10} />

      <Sparkles count={120} scale={10} size={3} speed={0.4} opacity={0.6} color="#fbbf24" />
      <Sparkles count={120} scale={12} size={2.5} speed={0.3} opacity={0.5} color="#60a5fa" />

      <group ref={meshRef}>
        <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
          <mesh>
            <icosahedronGeometry args={[2, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              wireframe
              emissive="#d97706"
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh scale={0.75}>
            <octahedronGeometry args={[1.6, 2]} />
            <meshPhysicalMaterial
              color="#1e1b4b"
              roughness={0.1}
              metalness={0.8}
              transmission={0.6}
              thickness={1.2}
              emissive="#1d4ed8"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>
      </group>
    </>
  );
}

// Komponen Pintu Navigasi 3D
function Door({
  position,
  rotation,
  label,
  onClick,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  label: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 4.4, 0.15]} />
        <meshStandardMaterial color="#1a1918" roughness={0.7} />
      </mesh>
      <mesh
        position={[0, 0, 0.05]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.02 : 1}
      >
        <boxGeometry args={[2.1, 4.1, 0.1]} />
        <meshStandardMaterial
          color={hovered ? "#3b82f6" : "#242322"}
          emissive={hovered ? "#1d4ed8" : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0.75, 0, 0.15]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#e4e4e7" metalness={0.9} roughness={0.1} />
      </mesh>
      <Text
        position={[0, 2.6, 0.1]}
        fontSize={0.28}
        color={hovered ? "#3b82f6" : "#4a4947"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Komponen Bingkai Karya + Lampu Sorot Sesuai Referensi Gambar
function PaintingFrame({
  artwork,
  position,
  rotation,
  onSelect,
}: {
  artwork: Artwork;
  position: [number, number, number];
  rotation: [number, number, number];
  onSelect: (art: Artwork) => void;
}) {
  const texture = useTexture(artwork.image);
  const [hovered, setHovered] = useState(false);
  const targetRef = useRef<THREE.Object3D>(null!);

  return (
    <group position={position} rotation={rotation}>
      <object3D ref={targetRef} position={[0, 0, 0]} />

      <group position={[0, 4.5, 0.4]}>
        <mesh>
          <cylinderGeometry args={[0.35, 0.4, 0.15, 32]} />
          <meshStandardMaterial color="#1a1918" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.08, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {targetRef.current && (
        <spotLight
          position={[0, 4.4, 0.4]}
          target={targetRef.current}
          intensity={120}
          angle={0.55}
          penumbra={0.7}
          color="#ffffff"
          distance={10}
        />
      )}

      <mesh
        onClick={() => onSelect(artwork)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.04 : 1}
      >
        <boxGeometry args={[2.24, 3.04, 0.08]} />
        <meshStandardMaterial color={hovered ? "#3b82f6" : "#d8d8dc"} metalness={0.6} roughness={0.2} />
      </mesh>

      <mesh
        position={[0, 0, 0.05]}
        onClick={() => onSelect(artwork)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.04 : 1}
      >
        <planeGeometry args={[2.1, 2.9]} />
        <meshStandardMaterial map={texture} roughness={0.3} />
      </mesh>

      <group position={[0, -1.75, 0.05]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.9, 0.45, 0.04]} />
          <meshStandardMaterial color="#4a2e18" roughness={0.7} metalness={0.1} />
        </mesh>

        <Text
          position={[0, 0, 0.03]}
          fontSize={0.11}
          maxWidth={1.75}
          textAlign="center"
          lineHeight={1.2}
          color={hovered ? "#93c5fd" : "#fef08a"}
          anchorX="center"
          anchorY="middle"
        >
          {artwork.title}
        </Text>
      </group>
    </group>
  );
}

// Scene Galeri 3D
function Gallery3DScene({
  currentRoom,
  artworks,
  analogInput,
  onSelect,
  onNavigate,
}: {
  currentRoom: number;
  artworks: Artwork[];
  analogInput: React.MutableRefObject<{ x: number; y: number }>;
  onSelect: (art: Artwork) => void;
  onNavigate: (roomId: number) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    const input = analogInput.current;
    if (Math.abs(input.x) < 0.01 && Math.abs(input.y) < 0.01) return;

    const moveSpeed = 4 * delta;
    const camera = state.camera;
    const target = controlsRef.current.target;

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveVector = new THREE.Vector3(0, 0, 0);
    moveVector.add(forward.clone().multiplyScalar(-input.y * moveSpeed));
    moveVector.add(right.clone().multiplyScalar(input.x * moveSpeed));

    if (moveVector.lengthSq() > 0) {
      camera.position.add(moveVector);
      target.add(moveVector);

      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -5, 5);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -3, 6);
      target.x = THREE.MathUtils.clamp(target.x, -5, 5);
      target.z = THREE.MathUtils.clamp(target.z, -8, 3);
    }
  });

  const getTransforms = (index: number, total: number) => {
    if (total === 2) {
      return { pos: [index === 0 ? -2 : 2, 0, -4.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] };
    }
    if (total === 3) {
      if (index === 0) return { pos: [-5.4, 0, -1] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] };
      if (index === 1) return { pos: [0, 0, -4.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] };
      return { pos: [5.4, 0, -1] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] };
    }
    if (total === 4) {
      if (index === 0) return { pos: [-5.4, 0, -1] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] };
      if (index === 1) return { pos: [-1.8, 0, -4.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] };
      if (index === 2) return { pos: [1.8, 0, -4.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] };
      return { pos: [5.4, 0, -1] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] };
    }
    if (index === 0) return { pos: [-5.4, 0, 1.5] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] };
    if (index === 1) return { pos: [-5.4, 0, -1.8] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] };
    if (index === 2) return { pos: [0, 0, -4.9] as [number, number, number], rot: [0, 0, 0] as [number, number, number] };
    if (index === 3) return { pos: [5.4, 0, -1.8] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] };
    return { pos: [5.4, 0, 1.5] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] };
  };

  return (
    <>
      <ambientLight intensity={0.7} color="#ede6dc" />
      <directionalLight position={[0, 8, 4]} intensity={0.6} color="#ffffff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#2b2a29" roughness={0.65} metalness={0.05} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.8, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#1c1b1a" roughness={0.9} />
      </mesh>

      <mesh position={[0, 1.4, -5]}>
        <planeGeometry args={[22, 6.8]} />
        <meshStandardMaterial color="#d8d1c5" roughness={0.9} />
      </mesh>

      <mesh position={[0, 1.4, 7]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[22, 6.8]} />
        <meshStandardMaterial color="#d0c9bd" roughness={0.9} />
      </mesh>

      <mesh position={[-5.5, 1.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[22, 6.8]} />
        <meshStandardMaterial color="#d4cdc1" roughness={0.9} />
      </mesh>

      <mesh position={[5.5, 1.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[22, 6.8]} />
        <meshStandardMaterial color="#d4cdc1" roughness={0.9} />
      </mesh>

      {artworks.map((art, idx) => {
        const { pos, rot } = getTransforms(idx, artworks.length);
        return (
          <PaintingFrame
            key={art.id}
            artwork={art}
            position={pos}
            rotation={rot}
            onSelect={onSelect}
          />
        );
      })}

      {currentRoom > 1 ? (
        <Door
          position={[-5.4, 0.2, 4]}
          rotation={[0, Math.PI / 2, 0]}
          label={`← Ruangan ${currentRoom - 1}`}
          onClick={() => onNavigate(currentRoom - 1)}
        />
      ) : (
        <Door
          position={[-5.4, 0.2, 4]}
          rotation={[0, Math.PI / 2, 0]}
          label="← Kembali ke Lobby"
          onClick={() => onNavigate(0)}
        />
      )}

      {currentRoom < 5 && (
        <Door
          position={[5.4, 0.2, 4]}
          rotation={[0, -Math.PI / 2, 0]}
          label={`Ruangan ${currentRoom + 1} →`}
          onClick={() => onNavigate(currentRoom + 1)}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        rotateSpeed={0.4}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={7}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </>
  );
}

// Komponen UI Joystick Analog di Kiri Bawah
function VirtualJoystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handlePointerStart = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const maxRadius = 40;
    const distance = Math.hypot(dx, dy);

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(distance, maxRadius);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });
    onMove(knobX / maxRadius, knobY / maxRadius);
  };

  const handlePointerEnd = () => {
    isDragging.current = false;
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div className={styles.joystickContainer}>
      <div
        ref={baseRef}
        className={styles.joystickBase}
        onPointerDown={handlePointerStart}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <div
          className={styles.joystickKnob}
          style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
        />
      </div>
      <span className={styles.joystickLabel}>Navigasi Gerak</span>
    </div>
  );
}

export default function VirtualGallery() {
  const [currentRoom, setCurrentRoom] = useState<number>(0);
  const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
  const analogInput = useRef({ x: 0, y: 0 });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const activeRoom = rooms[currentRoom];

  const handleJoystickMove = (x: number, y: number) => {
    analogInput.current = { x, y };
  };

  return (
    <main className={styles.mainContainer}>
      <audio ref={audioRef} src="/audio/bgm.mp3" loop preload="auto" />
      <button
        className={`${styles.musicToggleBtn} ${isPlaying ? styles.musicPlaying : ""}`}
        onClick={toggleAudio}
      >
        <span className={styles.musicIcon}>{isPlaying ? "🔊" : "🔈"}</span>
        <span className={styles.musicLabel}>{isPlaying ? "Musik: On" : "Musik: Off"}</span>
      </button>

      <nav className={styles.sidebar}>
        <h2 className={styles.logo}>ARTSPACE</h2>
        <div className={styles.menu}>
          {rooms.map((room, index) => (
            <button
              key={room.id}
              className={`${styles.navButton} ${currentRoom === index ? styles.active : ""}`}
              onClick={() => setCurrentRoom(index)}
            >
              {room.title}
            </button>
          ))}
        </div>
      </nav>

      <section className={styles.galleryView}>
        <header className={styles.roomHeader}>
          <h1 className={styles.roomTitle}>{activeRoom.title}</h1>
          <p className={styles.roomSubtitle}>
            {currentRoom === 0
              ? "Gunakan menu di samping untuk memasuki ruangan galeri."
              : "Tarik analog untuk berjalan, geser layar untuk melihat sekeliling, dan klik karya/pintu."}
          </p>
        </header>

        {currentRoom === 0 ? (
          <div className={styles.lobbyWrapper}>
            <div className={styles.lobbyCanvasWrapper}>
              <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <Suspense fallback={null}>
                  <LobbySoulScene />
                </Suspense>
              </Canvas>
            </div>

            <div className={styles.lobbyContentOverlay}>
              <div className={styles.artisticCard}>
                <div className={styles.dualityPill}>
                  <span className={styles.joyText}>Euphoria</span>
                  <span className={styles.dotDivider}>•</span>
                  <span className={styles.griefText}>Melancholia</span>
                </div>

                <h1 className={styles.artisticTitle}>THE SANCTUARY OF SOULS</h1>

                <p className={styles.artisticQuote}>
                  &ldquo;Di antara gemerlap tawa yang membuncah dan sunyinya air mata yang mengering, setiap goresan adalah rekaman atas jiwa yang terus bernyawa.&rdquo;
                </p>

                <p className={styles.artisticAuthor}>— Virtual Gallery Fauzan</p>

                <button
                  className={styles.enterGalleryBtn}
                  onClick={() => {
                    setCurrentRoom(1);
                    if (audioRef.current && !isPlaying) {
                      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  }}
                >
                  <span>Masuki Ruang Pameran</span>
                  <span className={styles.btnArrow}>→</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.canvasContainer}>
              <Canvas camera={{ position: [0, 0.5, 4.5], fov: 60 }}>
                <Suspense fallback={null}>
                  <Gallery3DScene
                    key={currentRoom}
                    currentRoom={currentRoom}
                    artworks={activeRoom.artworks}
                    analogInput={analogInput}
                    onSelect={setSelectedArt}
                    onNavigate={setCurrentRoom}
                  />
                </Suspense>
              </Canvas>
            </div>
            <VirtualJoystick onMove={handleJoystickMove} />
          </>
        )}
      </section>

      {selectedArt && (
        <div className={styles.modalOverlay} onClick={() => setSelectedArt(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedArt(null)}>
              ✕
            </button>
            <div className={styles.modalImageContainer}>
              <Image
                src={selectedArt.image}
                alt={selectedArt.title}
                fill
                sizes="500px"
                className={styles.modalImage}
              />
            </div>
            <div className={styles.modalDetails}>
              <span className={styles.modalYear}>Tahun Pembuatan: {selectedArt.year}</span>
              <h2 className={styles.modalTitle}>{selectedArt.title}</h2>
              <div className={styles.divider}></div>
              <p className={styles.modalDesc}>{selectedArt.desc}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}