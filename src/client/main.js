(function() {
  const preStatus = document.querySelector('[js-status]');

  const preLog = document.querySelector('[js-log]');
  const divLogWrapper = document.querySelector('[js-log-wrapper]');

  const txtConfig = document.querySelector('[js-config]');
  const divConfigWrapper = document.querySelector('[js-config-wrapper]');

  const btnShowLog = document.querySelector('[js-show-log]');
  const btnConnect = document.querySelector('[js-connect]');
  const btnDisconnect = document.querySelector('[js-disconnect]');

  const btnShowConfig = document.querySelector('[js-show-config]');
  const btnSaveConfig = document.querySelector('[js-save-config]');

  const apiPrefix = '';

  /** Loads the status and sets it in the apropriate html element (preStatus) */
  const fetchStatus = async () => {
    const status = await (await fetch(apiPrefix + '/api/status')).json();
    preStatus.textContent = status.data;
  };

  /** Loads the log data and sets it in preLog */
  const fetchLog = async () => {
    const log = await (await fetch(apiPrefix + '/api/log')).json();
    preLog.textContent = log.data.join('\r\n');
  };

  /** Loads the log data and sets it in preLog */
  const fetchConfig = async () => {
    const config = await (await fetch(apiPrefix + '/api/config')).json();
    txtConfig.textContent = JSON.stringify(config.data);
  };

  /** 'Validates' config and sends it to the backend */
  const updateConfig = async () => {
    try {
      const config = JSON.parse(txtConfig.value);
      if (!config.host || !config.password || !config.username) {
        throw new Error();
      }
      await fetch(apiPrefix + '/api/config', {
        method: 'POST',
        body: txtConfig.value,
        headers: { 'Content-Type': 'application/json' }
      });
      fetchConfig();
      toggleConfig();
    } catch (e) {
      console.error(e);
      alert('username, password, host required');
    }
  };

  /** Sends request to connect the StudNET client and reloads the status */
  const connect = async () => {
    await fetch(apiPrefix + '/api/connect', { method: 'POST' });
    fetchStatus();
  };

  /** Sends request to disconnect the StudNET client and reloads the status */
  const disconnect = async () => {
    await fetch(apiPrefix + '/api/disconnect', { method: 'POST' });
    fetchStatus();
  };

  /** Hide/display log. Also reloads the log if it gets displayed */
  const toggleLog = async () => {
    if (divLogWrapper.hasAttribute('hidden')) {
      await fetchLog();
    }
    divLogWrapper.toggleAttribute('hidden');
  };

  const toggleConfig = () => {
    if (divConfigWrapper.hasAttribute('hidden')) {
      fetchConfig();
    }
    divConfigWrapper.toggleAttribute('hidden');
  };

  // Fetch status initaly
  fetchStatus();
  fetchConfig();

  btnConnect.addEventListener('click', connect);
  btnDisconnect.addEventListener('click', disconnect);
  btnShowLog.addEventListener('click', toggleLog);
  btnSaveConfig.addEventListener('click', updateConfig);
  btnShowConfig.addEventListener('click', toggleConfig);
})();
