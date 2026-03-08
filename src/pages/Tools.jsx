import { useState } from 'react';
import { Code, Headphones, HardDrive, Battery, Video, BookOpen, Keyboard, Usb, Zap, Speaker } from 'lucide-react';

const Tools = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'Wszystkie', icon: Code },
        { id: 'audio', name: 'Audio', icon: Headphones },
        { id: 'storage', name: 'Storage', icon: HardDrive },
        { id: 'peripherals', name: 'Peryferia', icon: Keyboard },
        { id: 'power', name: 'Zasilanie', icon: Battery },
    ];

    const tools = [
        {
            id: 1,
            name: 'Apple AirPods 3rd Gen',
            category: 'audio',
            description: 'Idealne do słuchania podcastów o AI, konsultacji z zespołem i focus work. Spatial audio i długi czas pracy na baterii.',
            link: 'https://www.amazon.com/dp/B0BDHB9Y8H?tag=jimbo770c-20',
            icon: Headphones,
            tags: ['wireless', 'podcast', 'calls']
        },
        {
            id: 2,
            name: 'Logitech MX Master 3S',
            category: 'peripherals',
            description: 'Must-have dla każdego developera. Cicha praca, ergonomia i precyzja idealna do długich sesji kodowania.',
            link: 'https://www.amazon.com/dp/B09HM94VDS?tag=jimbo770c-20',
            icon: Code,
            tags: ['mouse', 'ergonomic', 'productivity']
        },
        {
            id: 3,
            name: 'Samsung T7 SSD 1TB',
            description: 'Szybki external storage dla dużych modeli LLM, datasetów i backupów projektów. 1050 MB/s read speed.',
            category: 'storage',
            link: 'https://www.amazon.com/dp/B0874XN4D8?tag=jimbo770c-20',
            icon: HardDrive,
            tags: ['ssd', 'portable', 'fast']
        },
        {
            id: 4,
            name: 'Anker PowerBank 20k mAh',
            description: 'Power delivery dla laptopa, telefonu i tabletu podczas pracy zdalnej. Niezbędnik każdego digital nomada.',
            category: 'power',
            link: 'https://www.amazon.com/dp/B08LH26PFT?tag=jimbo770c-20',
            icon: Battery,
            tags: ['portable', 'charging', 'travel']
        },
        {
            id: 5,
            name: 'Logitech C920 Webcam',
            description: 'Full HD kamerka do video calls, streamowania i nagrywania tutoriali. Sprawdzona jakość w rozsądnej cenie.',
            category: 'peripherals',
            link: 'https://www.amazon.com/dp/B006JH8T3S?tag=jimbo770c-20',
            icon: Video,
            tags: ['webcam', 'streaming', '1080p']
        },
        {
            id: 6,
            name: 'Kindle Paperwhite',
            description: 'Czytanie dokumentacji technicznej, whitepaperów i książek o AI bez męczenia oczu. E-ink to game changer.',
            category: 'peripherals',
            link: 'https://www.amazon.com/dp/B08KTZ8249?tag=jimbo770c-20',
            icon: BookOpen,
            tags: ['e-reader', 'documentation', 'reading']
        },
        {
            id: 7,
            name: 'Keychron Mechanical Keyboard',
            description: 'Hot-swappable mechanical keyboard dla tych, którzy cenią tactile feedback podczas pisania kodu.',
            category: 'peripherals',
            link: 'https://www.amazon.com/dp/B07YB32H52?tag=jimbo770c-20',
            icon: Keyboard,
            tags: ['mechanical', 'typing', 'switches']
        },
        {
            id: 8,
            name: 'Anker USB-C Hub',
            description: 'Multi-port hub z HDMI, USB 3.0 i czytnikiem kart SD. Rozwiązanie problemu "brakuje mi portów".',
            category: 'peripherals',
            link: 'https://www.amazon.com/dp/B07ZVKTP53?tag=jimbo770c-20',
            icon: Usb,
            tags: ['hub', 'usb-c', 'multiport']
        },
        {
            id: 9,
            name: 'Anker 65W Charger',
            description: 'Kompaktowa ładowarka GaN do laptopa, która zajmuje 50% mniej miejsca niż standardowe zasilacze.',
            category: 'power',
            link: 'https://www.amazon.com/dp/B09C5RG6KV?tag=jimbo770c-20',
            icon: Zap,
            tags: ['charger', 'gan', 'compact']
        },
        {
            id: 10,
            name: 'Sony WH-1000XM5',
            description: 'Top-tier noise cancelling dla deep work. Kiedy potrzebujesz całkowitego skupienia na złożonym problemie.',
            category: 'audio',
            link: 'https://www.amazon.com/dp/B09XS7JWHH?tag=jimbo770c-20',
            icon: Speaker,
            tags: ['headphones', 'anc', 'premium']
        },
        {
            id: 11,
            name: 'Echo Dot 5th Gen',
            description: 'Smart speaker z Alexa do kontroli głosowej workspace. Timery, przypomnienia i muzyka hands-free.',
            category: 'audio',
            link: 'https://www.amazon.com/dp/B09B8V1LZ3?tag=jimbo770c-20',
            icon: Speaker,
            tags: ['smart-speaker', 'alexa', 'voice']
        },
        {
            id: 12,
            name: 'Apple AirPods Pro 2',
            description: 'Premium ANC earbuds z adaptacyjnym audio. Najlepsze do pracy w głośnych środowiskach.',
            category: 'audio',
            link: 'https://www.amazon.com/dp/B0CHX1W1Z5?tag=jimbo770c-20',
            icon: Headphones,
            tags: ['wireless', 'anc', 'premium']
        }
    ];

    const filteredTools = activeCategory === 'all'
        ? tools
        : tools.filter(tool => tool.category === activeCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzhjNWZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

                <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-2 mb-6">
                            <Code className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300 font-mono">Developer Tools</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Polecane Narzędzia
                        </h1>

                        <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                            Hardware i gadżety, które używam daily do pracy nad projektami AI i development.
                            Sprawdzone w boju, godne polecenia.
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tools Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map(tool => {
                        const Icon = tool.icon;
                        return (
                            <div
                                key={tool.id}
                                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/30 transition-colors">
                                        <Icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-purple-400 transition-colors">
                                            {tool.name}
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                    {tool.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tool.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-400 font-mono"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href={tool.link}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                >
                                    Sprawdź cenę →
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Disclaimer */}
                <div className="mt-12 p-6 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                    <p className="text-sm text-slate-400 text-center">
                        💡 <strong>Disclaimer:</strong> Linki prowadzą do Amazon ze znacznikiem afiliacyjnym.
                        Jeśli coś kupisz, dostanę małą prowizję bez dodatkowych kosztów po Twojej stronie.
                        Polecam tylko rzeczy, których sam używam lub które są rekomendowane przez community.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Tools;
