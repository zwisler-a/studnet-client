(async function() {
  const preStatus = document.querySelector('[js-status]');
  const preLog = document.querySelector('[js-log]');
  const divLogWrapper = document.querySelector('[js-log-wrapper]');
  const btnShowLog = document.querySelector('[js-show-log]');
  const btnConnect = document.querySelector('[js-connect]');
  const btnDisconnect = document.querySelector('[js-disconnect]');

  const fetchStatus = async () => {
    const status = await (await fetch('/api/status')).json();
    preStatus.textContent = status.data;
  };

  const fetchLog = async () => {
    const log = await (await fetch('/api/log')).json();
    preLog.textContent = log.data.join('\r\n');
  };

  const connect = async () => {
    await fetch('/api/connect', { method: 'POST' });
    fetchStatus();
  };

  const disconnect = async () => {
    await fetch('/api/disconnect', { method: 'POST' });
    fetchStatus();
  };

  const toggleLog = async () => {
    if (divLogWrapper.hasAttribute('hidden')) {
      await fetchLog();
    }
    divLogWrapper.toggleAttribute('hidden');
  };

  fetchStatus();

  btnConnect.addEventListener('click', connect);
  btnDisconnect.addEventListener('click', disconnect);
  btnShowLog.addEventListener('click', toggleLog);
})();
