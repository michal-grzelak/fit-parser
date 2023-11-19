export const mapDataIntoLap = (inputLaps, lapKey, data) => {
  const laps = JSON.parse(JSON.stringify(inputLaps));
  let index = 0;
  for (let i = 0; i < laps.length; i++) {
    const lap = laps[i];
    const nextLap = laps[i + 1];
    const tempData = [];
    const lapStartTime = new Date(lap.startTime).getTime();
    const nextLapStartTime = nextLap ? new Date(nextLap.start_time).getTime() : null;
    for (let j = index; j < data.length; j++) {
      const row = data[j];
      if (nextLap) {
        const timestamp = new Date(row.timestamp).getTime();
        if (lapStartTime <= timestamp && nextLapStartTime >= timestamp) {
          tempData.push(row);
        } else if (nextLapStartTime < timestamp) {
          laps[i][lapKey] = tempData;
          index = j;
          break;
        }
      } else {
        tempData.push(row);
      }
    }

    if (!laps[i][lapKey]) {
      laps[i][lapKey] = tempData;
    }
  }

  return laps;
};

export const mapDataIntoSession = (inputSessions, inputLaps, lengths, records) => {
  const sessions = JSON.parse(JSON.stringify(inputSessions));
  let laps = JSON.parse(JSON.stringify(inputLaps));
  laps = mapDataIntoLap(laps, 'lengths', lengths);
  laps = mapDataIntoLap(laps, 'records', records);
  let lapIndex = 0;
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    const nextSession = sessions[i + 1];
    const tempLaps = [];
    const sessionStartTime = new Date(session.start_time).getTime();
    const nextSessionStartTime = nextSession ? new Date(nextSession.start_time).getTime() : null;
    for (let j = lapIndex; j < laps.length; j++) {
      const lap = laps[j];
      if (nextSession) {
        const lapStartTime = new Date(lap.start_time).getTime();
        if (sessionStartTime <= lapStartTime && nextSessionStartTime >= lapStartTime) {
          tempLaps.push(lap);
        } else if (nextSessionStartTime < lapStartTime) {
          sessions[i].laps = tempLaps;
          lapIndex = j;
          break;
        }
      } else {
        tempLaps.push(lap);
      }
    }

    if (!sessions[i].laps) {
      sessions[i].laps = tempLaps;
    }
  }
  return sessions;
};
