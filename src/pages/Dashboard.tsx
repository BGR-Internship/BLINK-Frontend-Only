import FeatureCarousel from '../components/FeatureCarousel';
import BentoGrid from '../components/BentoGrid';

const Dashboard = () => {
    return (
        // Changed: Removed the Grid system. Now it is a simple vertical stack.
        <div className="space-y-8 max-w-7xl mx-auto w-full">
            {/* Main Content Area - Now takes full width */}
            <div className="space-y-8">
                <FeatureCarousel />
                <BentoGrid />
            </div>

            {/* DELETED: Right Side Panel (StatusWidget) */}
        </div>
    );
};

export default Dashboard;