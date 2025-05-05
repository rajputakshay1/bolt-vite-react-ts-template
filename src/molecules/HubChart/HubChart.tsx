import HighCharts from 'highcharts';
import HighchartsReact, { HighchartsReactProps } from 'highcharts-react-official';
export interface HubChartProps extends HighchartsReactProps {
    // highchart module factory functions to be intialized before rendering
    modules?: ((highcharts: typeof HighCharts) => void)[];
}

/**
 * Renders a HubChart component with the given modules and props.
 * Component is based on https://github.com/highcharts/highcharts-react.
 * All props applicable to HighChartsReact are applicable here too.
 * @param {HubChartProps} modules - An array of modules to be applied to the HighCharts component.
 * @param {RestProps} rest - Additional props to be spread onto the HighchartsReact component.
 * @return {JSX.Element} The rendered HighchartsReact component.
 */
export const HubChart = ({ modules, ...rest }: HubChartProps) => {
    modules?.forEach((module) => {
        module(HighCharts);
    });
    return <HighchartsReact highcharts={HighCharts} {...rest} />;
};
