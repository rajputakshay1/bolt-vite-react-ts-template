import { useEffect, useRef, memo, useMemo, useState } from 'react';
import { HubTypography } from './molecules/HubTypography/HubTypography';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import {
    addDays,
    differenceInDays,
    format,
    getYear,
    isAfter,
    isBefore,
    isEqual,
    isSameMonth,
    setMonth,
    startOfMonth,
} from 'date-fns';
import {
    DayPicker,
    DateRange,
    Matcher,
    CaptionLabelProps,
    useNavigation,
    useDayPicker,
    Day,
} from 'react-day-picker';
import { HubCloseIcon } from '../../icons';
import './HubDatePicker.scss';

export enum DatePickerType {
    Range = 'range',
    Single = 'single',
}

export type DatePickerSelectionOptions = {
    colFieldsRestrictingFutureDates?: string[];
    colFieldsRestrictingPastDates?: string[];
};

export interface HubDatePickerProps {
    type: DatePickerType; // Range or Single
    toMonth?: Date; // Navigate to month restriction - this will be limit for future months
    fromMonth?: Date; // Navigate from month restriction - this will be the limit for past months
    disableFutureDays?: boolean;
    disablePastDays?: boolean;
    disabledCustomDays?: Matcher[]; // Custom list of disabled days - can disable specific days of week, weekends or other types of combinations
    monthYearPickerOnly?: boolean; // This flag makes the date picker month/year picker only, without the ability to choose a day.
    useMonthYearPicker?: boolean; // This flag activates the month/year picker features, must be true if using monthYearPickerOnly flag.
    onRangePick?: (data: DateRange) => void; // Called when a range is picked - will be called on every day selection
    onDatePick?: (data: Date) => void; // Called when a day is selected or if monthYearPickerOnly is active, gets called when month is selected
    yearsRangeStartOffset?: number; // The number of years to offset the start of the years range. Default value is 10
    yearsRangeEndOffset?: number; // The number of years to offset the end of the years range. Default value is 10
}

/**
 * HubDatePicker is a date picker based on react-day-picker https://react-day-picker.js.org/ component.
 * Allows selection of dates, ranges and is pretty customizable, with props.
 * @param {HubDatePickerProps}
 * @returns {*} {ReactElement}
 */
export function HubDatePicker({
    type,
    toMonth,
    fromMonth,
    disableFutureDays,
    disablePastDays,
    disabledCustomDays,
    monthYearPickerOnly,
    useMonthYearPicker,
    onRangePick,
    onDatePick,
    yearsRangeStartOffset = 10,
    yearsRangeEndOffset = 10,
}: HubDatePickerProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [showMonthsList, setShowMonthsList] = useState<boolean>(monthYearPickerOnly || false);
    const [showYearsList, setShowYearsList] = useState<boolean>(false);

    const pickerStyleHeightOverride = showMonthsList || showYearsList ? { maxHeight: '280px' } : {};

    const disabledDays: Matcher[] = useMemo(() => {
        const disabledDaysList = [] as Matcher[];
        if (disableFutureDays) {
            const future = { after: new Date() };
            disabledDaysList.push(future);
        }
        if (disablePastDays) {
            const past = { before: new Date() };
            disabledDaysList.push(past);
        }

        return disabledCustomDays ? [...disabledCustomDays, ...disabledDaysList] : disabledDaysList;
    }, [disablePastDays, disableFutureDays, disabledCustomDays]);

    const onDateSelect = (date: any) => {
        setSelectedDate(date);
        if (onDatePick) onDatePick(date);
    };

    const onDateRangeSelect = (data: DateRange | undefined) => {
        setDateRange(data);
        if (onRangePick) onRangePick(data!);
    };

    // Component override for the month/year header
    const MonthPicker = memo((props: CaptionLabelProps) => {
        // Reference to the years list container
        const yearsListRef = useRef<HTMLDivElement | null>(null);
        const { currentMonth, goToMonth, goToDate } = useNavigation();

        useEffect(() => {
            // Find the button corresponding to the currently selected year
            const selectedYearButton = yearsListRef.current?.querySelector('.selected-year');
            // Scroll the selected year into view if it exists
            if (selectedYearButton) {
                selectedYearButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // Scroll to the center of the container
                });
            }
        }, [currentMonth]); // Run when currentMonth changes

        const { mode, fromYear, toYear } = useDayPicker();
        const dropdownMonths: Date[] = [];

        const startOfMonthDate = startOfMonth(currentMonth); // Any date should be OK, as we just need the year
        const currentYear = getYear(new Date());

        for (let dropdownMonth = 0; dropdownMonth <= 11; dropdownMonth++) {
            const monthEntry = setMonth(startOfMonthDate, dropdownMonth);
            dropdownMonths.push(monthEntry);
        }

        const yearsRangeMin = currentYear - yearsRangeStartOffset;
        const yearsRangeMax = currentYear + yearsRangeEndOffset;
        const yearsRange = yearsRangeMax - yearsRangeMin;

        const dropdownYears: number[] = Array.from(
            { length: yearsRange },
            (v, k) => k + yearsRangeMin,
        );

        const handleMonthChange = (month: Date) => {
            const monthToNavigate = new Date(month.setFullYear(currentMonth.getFullYear()));
            goToMonth(monthToNavigate);

            // If date is already selected, offset that date to the new month
            if (selectedDate && mode === 'single') {
                onDateSelect(new Date(selectedDate.setMonth(month.getMonth())));
            }

            // If date range is selected, offset the range to the selected month
            if (dateRange && mode === 'range' && dateRange.from && dateRange.to) {
                let newRange = { from: dateRange?.from, to: dateRange?.to } as DateRange;
                const diff = differenceInDays(dateRange.to, dateRange.from);
                newRange.from = new Date(dateRange.from.setMonth(month.getMonth()));
                newRange.to = addDays(newRange.from, diff);
                onDateRangeSelect(newRange);
            }

            setShowMonthsList(false);

            // if monthYearPickerOnly is active, show the years picker instead of closing the month picker and showing the days
            if (monthYearPickerOnly) {
                setShowYearsList(true);
                onDateSelect(month);
            }
        };

        const handleYearChange = (year: number) => {
            let nextDate = new Date(currentMonth.setFullYear(year));
            if (isAfter(nextDate, toMonth!)) {
                nextDate = toMonth!;
            }
            if (isBefore(nextDate, fromMonth!)) {
                nextDate = fromMonth!;
            }
            const isTargetDateDisabled = !isEqual(
                new Date(currentMonth.setFullYear(year)),
                nextDate,
            );
            goToDate(nextDate);
            if (selectedDate && mode === 'single') {
                const newDate = new Date(selectedDate.setFullYear(year));
                const targetDate = isTargetDateDisabled
                    ? new Date(
                          new Date(selectedDate.setFullYear(year)).setMonth(nextDate.getMonth()),
                      )
                    : newDate;

                onDateSelect(targetDate);
            }
            if (dateRange && mode === 'range' && dateRange.from && dateRange.to) {
                let newRange = { from: dateRange.from, to: dateRange.to } as DateRange;
                const diff = differenceInDays(dateRange.to, dateRange.from);
                const targetFromDate = isTargetDateDisabled
                    ? new Date(
                          new Date(dateRange.from.setFullYear(year)).setMonth(nextDate.getMonth()),
                      )
                    : new Date(dateRange.from.setFullYear(year));
                newRange.from = targetFromDate;
                newRange.to = addDays(newRange.from, diff);
                onDateRangeSelect(newRange);
            }
            if (!monthYearPickerOnly) {
                setShowYearsList(false);
            }
        };

        return (
            <div>
                <Button
                    aria-label='Month picker'
                    onClick={() => {
                        if (showYearsList) {
                            setShowYearsList(false);
                        }
                        setShowMonthsList(true);
                    }}
                    disabled={!useMonthYearPicker}
                >
                    {format(props.displayMonth, 'MMMM').toUpperCase()}
                </Button>
                <Button
                    aria-label='Year picker'
                    onClick={() => setShowYearsList(true)}
                    disabled={!useMonthYearPicker}
                >
                    {format(props.displayMonth, 'yyyy')}
                </Button>
                {showMonthsList && useMonthYearPicker && (
                    <div
                        className='months-popup'
                        data-testid='months-popup'
                        style={{ marginTop: monthYearPickerOnly ? '60px' : '0' }}
                    >
                        {!monthYearPickerOnly && (
                            <div className='months-popup-header'>
                                <HubTypography variant='bodyLarge'>Select Month</HubTypography>
                                <Fab
                                    variant='extended'
                                    size='small'
                                    onClick={() => setShowMonthsList(!showMonthsList)}
                                >
                                    <HubCloseIcon />
                                </Fab>
                            </div>
                        )}
                        <div className='months-list'>
                            {dropdownMonths.map((month) => {
                                const isSelected =
                                    props.displayMonth.getMonth() === month.getMonth();
                                return (
                                    <Fab
                                        sx={{
                                            backgroundColor: isSelected ? '#3D6F8C' : 'transparent',
                                            color: isSelected ? 'white' : 'inherit',
                                        }}
                                        onClick={() => handleMonthChange(month)}
                                        variant='extended'
                                        size='small'
                                        key={month.getMonth()}
                                        disabled={
                                            Boolean(
                                                fromMonth &&
                                                    isBefore(month, fromMonth) &&
                                                    !isSameMonth(month, fromMonth),
                                            ) ||
                                            Boolean(
                                                toMonth &&
                                                    isAfter(month, toMonth) &&
                                                    !isSameMonth(month, toMonth),
                                            )
                                        }
                                    >
                                        {format(month, 'MMM').toUpperCase()}
                                    </Fab>
                                );
                            })}
                        </div>
                    </div>
                )}
                {showYearsList && useMonthYearPicker && (
                    <div
                        className='years-popup'
                        data-testid='years-popup'
                        style={{ marginTop: monthYearPickerOnly ? '60px' : '0' }}
                    >
                        {!monthYearPickerOnly && (
                            <div className='years-popup-header'>
                                <HubTypography variant='bodyLarge'>Select Year</HubTypography>
                                <Fab
                                    variant='extended'
                                    size='small'
                                    onClick={() => setShowYearsList(false)}
                                >
                                    <HubCloseIcon />
                                </Fab>
                            </div>
                        )}
                        <div className='years-list' ref={yearsListRef}>
                            {dropdownYears.map((year) => {
                                const isSelected = currentMonth.getFullYear() === year;
                                return (
                                    <Fab
                                        sx={{
                                            backgroundColor: isSelected ? '#3D6F8C' : 'transparent',
                                            color: isSelected ? 'white' : 'inherit',
                                        }}
                                        variant='extended'
                                        size='small'
                                        key={year}
                                        onClick={() => handleYearChange(year)}
                                        disabled={
                                            Boolean(
                                                (fromMonth && year < fromMonth?.getFullYear()) ||
                                                    (fromYear && year < fromYear),
                                            ) ||
                                            Boolean(
                                                (toMonth && year > toMonth?.getFullYear()) ||
                                                    (toYear && year > toYear),
                                            )
                                        }
                                        className={isSelected ? 'selected-year' : ''} // Conditionally add class
                                    >
                                        {year}
                                    </Fab>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    });

    return (
        <>
            {type === DatePickerType.Single && (
                <DayPicker
                    mode='single'
                    style={pickerStyleHeightOverride}
                    selected={selectedDate}
                    onSelect={(date) => {
                        if (date) onDateSelect(date);
                    }}
                    className={`hub_date_picker ${
                        showMonthsList || showYearsList ? 'hub_date_picker_month-year-overlay' : ''
                    }`}
                    data-qa='hub-date-picker'
                    toMonth={toMonth}
                    fromMonth={fromMonth}
                    showOutsideDays
                    disabled={disabledDays}
                    components={{
                        CaptionLabel: MonthPicker,
                    }}
                />
            )}
            {type === DatePickerType.Range && (
                <DayPicker
                    mode='range'
                    selected={dateRange}
                    style={pickerStyleHeightOverride}
                    onSelect={onDateRangeSelect}
                    className={`hub_date_picker ${
                        showMonthsList || showYearsList ? 'hub_date_picker_month-year-overlay' : ''
                    }`}
                    data-qa='hub-date-picker'
                    toMonth={toMonth}
                    fromMonth={fromMonth}
                    showOutsideDays
                    disabled={disabledDays}
                    components={{
                        CaptionLabel: MonthPicker,
                        Day: (dayProps) => {
                            let className = undefined;
                            if (dateRange?.to && dateRange?.from) {
                                if (isEqual(dayProps.date, dateRange.to)) {
                                    className = 'day-wrapper_range_start';
                                }
                                if (isEqual(dayProps.date, dateRange.from)) {
                                    className = 'day-wrapper_range_end';
                                }
                            }

                            return (
                                <div className={className}>
                                    <Day {...dayProps} />
                                </div>
                            );
                        },
                    }}
                />
            )}
        </>
    );
}
