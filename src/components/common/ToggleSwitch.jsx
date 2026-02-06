import * as Switch from '@radix-ui/react-switch';
import PropTypes from 'prop-types';

/**
 * ToggleSwitch Component
 * Modern toggle switch using Radix UI Switch primitive
 *
 * @param {boolean} checked - Whether the switch is checked
 * @param {function} onChange - Callback when switch state changes
 * @param {boolean} disabled - Whether the switch is disabled
 */
const ToggleSwitch = ({ checked, onChange, disabled = false }) => {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      className={`
        relative w-11 h-6 rounded-full transition-colors duration-200
        ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Switch.Thumb
        className={`
          block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-6' : 'translate-x-0.5'}
          mt-0.5
        `}
      />
    </Switch.Root>
  );
};

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default ToggleSwitch;
