import { 
  Dashboard, 
  AssessmentOutlined, 
  EventNote, 
  Person, 
  Settings 
} from '@mui/icons-material';

/**
 * Get Material-UI icon component by name
 * This allows us to store icon names as strings in data files
 */
export const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType> = {
    Dashboard,
    AssessmentOutlined,
    EventNote,
    Person,
    Settings
  };
  
  const IconComponent = icons[iconName];
  return IconComponent ? <IconComponent /> : <Dashboard />;
};
