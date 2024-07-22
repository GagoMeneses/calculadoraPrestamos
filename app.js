document.getElementById('loan-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('amount').value);
  const months = parseInt(document.getElementById('months').value);
  const rate = parseFloat(document.getElementById('rate').value) / 100;

  const monthlyPayment = calcularPagoMensualConstante(amount, months, rate);
  document.getElementById('monthly-payment').innerText = `Pago Mensual: ${monthlyPayment.toFixed(2)}`;

  const schedule = detallePagosMensualesConstantes(amount, months, rate, monthlyPayment);
  const tbody = document.querySelector('#payment-schedule tbody');
  tbody.innerHTML = '';
  schedule.forEach(payment => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${payment.Mes}</td>
          <td>${payment['Capital Restante']}</td>
          <td>${payment.Interés}</td>
          <td>${payment['Abono Capital']}</td>
          <td>${payment['Pago Mensual']}</td>
      `;
      tbody.appendChild(row);
  });

  document.getElementById('results').style.display = 'block';
});

document.querySelector('.reiniciarCaja').addEventListener('click', function() {
  document.getElementById('loan-form').reset();
  document.getElementById('results').style.display = 'none';
  document.getElementById('monthly-payment').innerText = '';
  document.querySelector('#payment-schedule tbody').innerHTML = '';
});

function calcularPagoMensualConstante(capital_inicial, meses, interes_mensual) {
  const r = interes_mensual;
  const n = meses;
  const P = capital_inicial;
  const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return M;
}

function detallePagosMensualesConstantes(capital_inicial, meses, interes_mensual, pago_mensual) {
  const pagos = [];
  let capital_restante = capital_inicial;

  for (let mes = 1; mes <= meses; mes++) {
      const interes = capital_restante * interes_mensual;
      const abono_capital = pago_mensual - interes;
      pagos.push({
          Mes: mes,
          'Capital Restante': capital_restante.toFixed(2),
          Interés: interes.toFixed(2),
          'Abono Capital': abono_capital.toFixed(2),
          'Pago Mensual': pago_mensual.toFixed(2)
      });
      capital_restante -= abono_capital;
  }

  return pagos;
}