import { Link } from 'react-router-dom';
import { ExternalLink, Wrench } from 'lucide-react';

const RecommendedTools = ({ tools }) => {
    const defaultTools = [
        {
            name: 'Logitech MX Master 3S',
            description: 'Najlepsza myszka dla developerów',
            link: 'https://www.amazon.com/dp/B09HM94VDS?tag=jimbo770c-20'
        },
        {
            name: 'Samsung T7 SSD',
            description: 'Szybki storage dla modeli AI',
            link: 'https://www.amazon.com/dp/B0874XN4D8?tag=jimbo770c-20'
        },
        {
            name: 'Sony WH-1000XM5',
            description: 'ANC do deep focus',
            link: 'https://www.amazon.com/dp/B09XS7JWHH?tag=jimbo770c-20'
        }
    ];

    const toolsToShow = tools || defaultTools;

    return (
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Narzędzia użyte w projekcie</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {toolsToShow.map((tool, idx) => (
                    <a
                        key={idx}
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors group"
                    >
                        <ExternalLink className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 group-hover:text-purple-300" />
                        <div>
                            <div className="font-medium text-white text-sm group-hover:text-purple-300 transition-colors">
                                {tool.name}
                            </div>
                            <div className="text-xs text-slate-400">
                                {tool.description}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <Link
                to="/tools"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
                Zobacz wszystkie rekomendacje →
            </Link>

            <p className="text-xs text-slate-500 mt-3">
                Linki afiliacyjne Amazon - kupując coś, wspierasz rozwój bloga bez dodatkowych kosztów.
            </p>
        </div>
    );
};

export default RecommendedTools;
