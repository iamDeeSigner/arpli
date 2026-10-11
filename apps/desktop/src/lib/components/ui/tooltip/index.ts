import { Tooltip as TooltipPrimitive } from 'bits-ui';
import Trigger from './tooltip-trigger.svelte';
import Content from './tooltip-content.svelte';
import Tooltip from './Tooltip.svelte';
import TooltipRich from './TooltipRich.svelte';
import TooltipShortcut from './TooltipShortcut.svelte';
import Root from './tooltip-root.svelte';


const Provider = TooltipPrimitive.Provider;
const Portal = TooltipPrimitive.Portal;

export {
  Root,
  Trigger,
  Content,
  Provider,
  Portal,
  //
  Root as TooltipRoot,
  Content as TooltipContent,
  Trigger as TooltipTrigger,
  Provider as TooltipProvider,
  Portal as TooltipPortal,
  //
  Tooltip,
  TooltipRich,
  TooltipShortcut,
};
