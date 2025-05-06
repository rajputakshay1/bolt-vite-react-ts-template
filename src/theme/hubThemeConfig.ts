import { PaletteMode } from '@mui/material';
import { grey, yellow } from '@mui/material/colors';
import { hubColors, HubColorsProps } from './hubStyleVariables';
import { hubTypography } from './hubTypography';

export const getThemeBaseConfig = (mode: PaletteMode) => {
    return {
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                      // palette values for light mode
                      primary: {
                          main: hubColors.primary.default,
                          dark: hubColors.primary.dark1,
                          dark2: hubColors.primary.dark2,
                          darker: hubColors.primary.darker,
                          light: hubColors.primary.light1,
                          light2: hubColors.primary.light2,
                          contrastText: '#fff',
                      },
                      secondary: {
                          main: hubColors.secondary['-1'],
                          minimal: hubColors.secondary['-5'],
                          subtle: hubColors.secondary['-2'],
                          bold: hubColors.secondary['0'],
                      },
                      grey: {
                          grey1: hubColors.grey.grey1,
                          grey2: hubColors.grey.grey2,
                          grey3: hubColors.grey.grey3,
                          grey4: hubColors.grey.grey4,
                      },
                      text: {
                          primary: hubColors.onSurface.default,
                          onSurface: {
                              regular: hubColors.onSurface.default,
                              deemphasised: hubColors.onSurface.deemphasised,
                              disabled: hubColors.onSurface.disabled,
                              emphasised: hubColors.onSurface.emphasised,
                              red: hubColors.onSurface.red,
                              yellow: hubColors.onSurface.yellow,
                              green: hubColors.onSurface.green,
                          },
                          neutral: {
                              primary: hubColors.neutralGrey['8'],
                              secondary: hubColors.neutralGrey['7'],
                              deemphasised: hubColors.neutralGrey['6'],
                              disabled: hubColors.neutralGrey['5'],
                          },
                          white: {
                              primary: hubColors.neutralGrey['0'],
                              deemphasised: hubColors.neutralGrey['3'],
                              disabled: hubColors.neutralGrey['4'],
                          },
                          primaryBlue: {
                              primary: hubColors.primaryBlue['0'],
                          },
                      },
                      bg: {
                          primary: hubColors.neutralGrey['0'],
                          secondary: hubColors.neutralGrey['2'],
                          tertiary: hubColors.neutralGrey['3'],
                      },
                      table: {
                          row: {
                              background: {
                                  primary: hubColors.neutralGrey['0'],
                                  secondary: hubColors.neutralGrey['2'],
                              },
                          },
                      },
                      stroke: {
                          default: {
                              state: {
                                  minimal: hubColors.neutralGrey['2'],
                                  subtle: hubColors.neutralGrey['4'],
                                  bold: hubColors.neutralGrey['6'],
                              },
                          },
                          hover: {
                              state: hubColors.primaryBlue['-3'],
                          },
                          selected: {
                              state: hubColors.primaryBlue['+1'],
                          },
                      },
                      button: {
                          primary: {
                              background: {
                                  default: hubColors.primaryBlue['-1'],
                                  hover: hubColors.primaryBlue['+2'],
                                  disabled: hubColors.neutralGrey['5'],
                              },
                              text: {
                                  default: hubColors.neutralGrey['0'],
                                  disabled: hubColors.neutralGrey['4'],
                              },
                          },
                          secondary: {
                              background: {
                                  default: '#EFF3F6',
                                  hover: hubColors.neutralGrey['0'],
                                  disabled: hubColors.neutralGrey['4'],
                              },
                              text: {
                                  default: hubColors.primaryBlue['0'],
                                  hover: hubColors.primaryBlue['+2'],
                                  disabled: hubColors.neutralGrey['3'],
                              },
                              stroke: {
                                  default: hubColors.primaryBlue['-4'],
                                  hover: hubColors.primaryBlue['0'],
                              },
                          },
                          input: {
                              background: {
                                  fill: {
                                      default: hubColors.neutralGrey['0'],
                                  },
                              },
                              default: hubColors.neutralGrey['6'],
                              selected: hubColors.primaryBlue['-2'],
                              disabled: hubColors.neutralGrey['5'],
                              hover: {
                                  selected: hubColors.primaryBlue['-5'],
                                  notselected: hubColors.neutralGrey['3'],
                                  error: hubColors.errorRed['-4'],
                              },
                          },
                      },
                      tabs: {
                          default: hubColors.primaryBlue['-5'],
                          hovered: hubColors.primaryBlue['-4'],
                          text: {
                              default: hubColors.neutralGrey['6'],
                              selected: hubColors.primaryBlue['0'],
                          },
                          indicator: {
                              default: hubColors.primaryBlue['-1'],
                          },
                      },
                      header: {
                          background: hubColors.primaryBlue['-5'],
                          text: {
                              primary: hubColors.neutralGrey['8'],
                              secondary: hubColors.neutralGrey['7'],
                          },
                      },
                      signal: {
                          warning: {
                              minimal: hubColors.warningYellow['-5'],
                              subtle: hubColors.warningYellow['-2'],
                              bold: hubColors.warningYellow['0'],
                          },
                          error: {
                              minimal: hubColors.errorRed['-4'],
                              subtle: hubColors.errorRed['0'],
                              bold: hubColors.errorRed['+2'],
                          },
                          success: {
                              minimal: hubColors.successGreen['-4'],
                              subtle: hubColors.successGreen['-2'],
                              bold: hubColors.successGreen['+1'],
                          },
                      },
                      filter: {
                          card: {
                              background: {
                                  default: hubColors.neutralGrey['0'],
                                  hover: '#E8EEF2',
                                  selected: '#B9CDD9',
                                  selectedhovered: '#92B0C4',
                                  disabled: hubColors.neutralGrey['3'],
                                  edit: '#E5ECF0',
                              },
                              text: {
                                  default: hubColors.neutralGrey['6'],
                                  hover: hubColors.neutralGrey['8'],
                                  selected: hubColors.neutralGrey['8'],
                                  disabled: hubColors.neutralGrey['6'],
                                  edit: hubColors.primaryBlue['-3'],
                              },
                              stroke: {
                                  default: hubColors.neutralGrey['5'],
                                  hover: hubColors.primaryBlue['-2'],
                                  disabled: hubColors.neutralGrey['3'],
                                  edit: hubColors.primaryBlue['-2'],
                                  selected: '#B9CDD9',
                              },
                          },
                      },
                      selection: {
                          primary: {
                              1: hubColors.primaryBlue['-5'],
                              2: hubColors.primaryBlue['-4'],
                              3: hubColors.primaryBlue['-1'],
                          },
                      },
                      tooltip: {
                          background: hubColors.neutralGrey['0'],
                          color: hubColors.neutralGrey['+7'],
                      },
                      hubColors: hubColors,
                  }
                : {
                      // palette values for dark mode
                      primary: {
                          main: hubColors.primary.dark1,
                          dark: hubColors.primary.default,
                          light: hubColors.onSurface.deemphasised,
                          contrastText: '#fff',
                      },
                      background: {
                          default: grey['700'],
                          paper: hubColors.primary.default,
                      },
                      text: {
                          secondary: grey['700'],
                          primary: yellow['900'],
                      },
                      tooltip: {
                          background: hubColors.neutralGrey['+7'],
                          color: hubColors.neutralGrey['0'],
                      },
                      hubColors: hubColors,
                  }),
        },
        spacing: 4,
        typography: {
            ...hubTypography,
        },
    };
};
export default getThemeBaseConfig;

interface OnSurfaceProps {
    regular?: string;
    deemphasised?: string;
    disabled?: string;
    emphasised?: string;
    red?: string;
    yellow?: string;
    green?: string;
}

declare module '@mui/material/' {
    interface Color {
        grey1?: string;
        grey2?: string;
        grey3?: string;
        grey4?: string;
    }
}

declare module '@mui/material/styles' {
    interface Palette {
        hubColors: HubColorsProps;
    }
    interface PaletteOptions {
        hubColors: HubColorsProps;
    }

    interface TypeText {
        onSurface?: OnSurfaceProps;
    }

    interface PaletteColor {
        dark2?: string;
        darker?: string;
        light2?: string;
    }
    interface SimplePaletteColorOptions {
        dark2?: string;
        darker?: string;
        light2?: string;
    }
}
