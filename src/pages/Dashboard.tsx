import FeatureCarousel from '../components/FeatureCarousel';
import BentoGrid from '../components/BentoGrid';
import StatusWidget from '../components/StatusWidget';

const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-9 space-y-8">
                <FeatureCarousel />
                <BentoGrid />
            </div>

            {/* Right Side Panel */}
            <div className="lg:col-span-3">
                <StatusWidget />
            </div>
        </div>
    );
};

export default Dashboard;
