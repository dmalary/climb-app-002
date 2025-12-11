export function getSessionSummary(climbs) {
  let sends = 0;
  let flashes = 0;
  let fails = 0;

  for (const c of climbs) {
    if (c.flash) flashes += 1;
    else if (c.sent) sends += 1;
    else fails += 1;
  }

  return [
    { name: "Flashes", value: flashes },
    { name: "Sends", value: sends },
    { name: "Fails", value: fails }
  ];
}
