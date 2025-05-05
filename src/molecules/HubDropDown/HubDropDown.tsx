import './HubDropDown.scss';
import { HubCaretDownIcon } from './uiComponents/icons/monochrome/HubCaretDownIcon';
import { HubCheckMarkIcon } from './uiComponents/icons/monochrome/HubCheckMarkIcon';
import {
    MenuItem,
    FormHelperText,
    FormControl,
    MenuItemProps,
    FormControlProps,
} from '@mui/material';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import React, { ReactNode } from 'react';
import { HubTypography } from './molecules/HubTypography/HubTypography';

export interface HubDropDownProps extends SelectProps {
    label: string;
    options: (string | { key: string; label: string; disabled?: boolean; icon?: ReactNode })[];
    onDropdownSelect: (option: string) => void;
    onOptionClick?: (option: string) => void;
    selectedValue?: string;
    dropdownMaxHeight?: number;
    renderedValue?: string;
    disabled?: boolean;
    invalid?: boolean;
    'data-qa'?: string;
    defaultValue?: string;
    className?: string;
    menuItemProps?: MenuItemProps;
    formControlProps?: FormControlProps;
}

/**
 *
 * HubDropDown is a component based on https://mui.com/material-ui/react-select/. Often used in forms, this component offers a number of options when it comes to rendering chosen values or setting specific options.
 * @export
 * @param {HubDropDownProps} {
 *     label, - header for the dropdown
 *     options, - options to display in dropdown
 *     onDropdownSelect, - function for what happens when user selects an option - will not fire the onChange event if same option is selected
 *     onOptionClick, - function that is called when clicking on a specific option
 *     selectedValue, - default value selected, but can be changed upon selection of user
 *     dropdownMaxHeight, - maximum height for dropdown
 *     renderedValue, -  value shown in the drop down when selected (if different to the selectedValue)
 *     disabled = false, - whether to disable the drop down or not (grey styling)
 *     invalid = false, - whether to display the drop down as invalid (red styling)
 *     dataQa, - QA purposes
 *     defaultValue - default option value to be selected initially, if nothing is provided first value will be picked
 *     className - add class to wrapper div for dropdown
 *     menuItemProps - props to be passed on to underlying menu item component
 *     formControlProps - props to be passed on to underlying formControl component
 * }
 * @return {*}  {JSX.Element}
 */
export function HubDropDown({
    label,
    options,
    onDropdownSelect,
    onOptionClick,
    selectedValue,
    dropdownMaxHeight,
    renderedValue,
    disabled = false,
    invalid = false,
    'data-qa': dataQa,
    defaultValue,
    className,
    menuItemProps,
    formControlProps,
    ...props
}: HubDropDownProps): JSX.Element {
    React.useEffect(() => {
        // Using a prop as selectedValue instead of local state
        // if none is provided or is empty string, pass the first option to the function for selection handling

        if (options[0] && selectedValue == '') {
            if (!defaultValue) {
                defaultValue = typeof options[0] === 'string' ? options[0] : options[0].key;
            }
            onDropdownSelect(defaultValue);
        }
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        const { value } = event.target;
        // Use a prop function to set the value of the dropdown externally
        onDropdownSelect(value);
    };

    const iconWithValue = (value: string, icon?: ReactNode) => {
        return (
            <span className='hub_icon_with_value'>
                {icon}
                &nbsp;
                {value}{' '}
            </span>
        );
    };

    return (
        <div className={`hub_drop_down ${className || ''}`} data-qa='hub_drop_down'>
            <FormControl variant='standard' fullWidth disabled={disabled} {...formControlProps}>
                <FormHelperText
                    className='hub_form_helper_text'
                    data-qa='hub_drop_down_helper_text'
                >
                    <HubTypography variant='labelSmall'>{label}</HubTypography>
                </FormHelperText>
                <Select<string>
                    className='hub_select'
                    value={selectedValue as any}
                    onChange={handleChange}
                    renderValue={(_v: string) => {
                        let selectedItem =
                            typeof options[0] === 'string'
                                ? selectedValue
                                : (options.find((o: any) => o.key === selectedValue) as any)?.label;

                        let selectedIcon = (
                            options.find((o: any) => o.key === selectedValue) as any
                        )?.icon;
                        return (
                            <HubTypography
                                variant='bodyLarge'
                                sx={{
                                    color: invalid
                                        ? 'hubColors.onSurface.red'
                                        : 'hubColors.onSurface.default',
                                }}
                            >
                                {renderedValue
                                    ? renderedValue
                                    : iconWithValue(selectedItem, selectedIcon)}
                            </HubTypography>
                        );
                    }}
                    IconComponent={HubCaretDownIcon}
                    data-qa={dataQa && dataQa !== '' ? dataQa : 'hub_select'}
                    data-testid={'hub_select'}
                    MenuProps={{
                        PaperProps: { sx: { maxHeight: dropdownMaxHeight } },
                        PopoverClasses: { root: '__hubCLVersion__' },
                        ...props.MenuProps,
                    }}
                    disabled={disabled}
                    {...props}
                >
                    {options &&
                        options.map(
                            (
                                value:
                                    | string
                                    | {
                                          key: string;
                                          label: string;
                                          disabled?: boolean;
                                          icon?: ReactNode;
                                      },
                                i,
                            ) => {
                                let val =
                                    typeof value === 'string'
                                        ? { key: value, label: value }
                                        : value;
                                return (
                                    <MenuItem
                                        value={val.key}
                                        className='hub_menu_item'
                                        data-qa='hub_menu_item'
                                        key={i}
                                        disabled={val.disabled}
                                        onClick={() => {
                                            if (onOptionClick) {
                                                onOptionClick((val.key || val) as string);
                                            }
                                        }}
                                        {...menuItemProps}
                                    >
                                        <div className='hub_drop_down_icon' data-qa='hub_icon'>
                                            {val.key == selectedValue ? <HubCheckMarkIcon /> : null}
                                        </div>

                                        <HubTypography variant='bodyLarge'>
                                            {val.icon
                                                ? iconWithValue(val.label, val.icon)
                                                : iconWithValue(val.label)}
                                        </HubTypography>
                                    </MenuItem>
                                );
                            },
                        )}
                </Select>
            </FormControl>
        </div>
    );
}
