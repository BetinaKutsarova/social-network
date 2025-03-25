import type { NavItemProps } from '../../interfaces/profile';

export const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
	return (
		<button
			onClick={onClick}
			className={`nav-item ${isActive ? 'active' : ''}`}
		>
			{icon}
			<span className="nav-label">{label}</span>
		</button>
	);
};