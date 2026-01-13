import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: () => void;
}

const ToggleSwitch = ({ isOn, onToggle }: ToggleSwitchProps) => (
    <button
        type="button"
        role="switch"
        aria-checked={isOn}
        className={clsx(
            "w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            isOn ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
        )}
        onClick={onToggle}
    >
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
            className="bg-white w-6 h-6 rounded-full shadow-md"
            style={{
                marginLeft: isOn ? 'auto' : '0',
                marginRight: isOn ? '0' : 'auto' // Explicitly handle both sides for safety
            }}
        />
    </button>
);

export default ToggleSwitch;
