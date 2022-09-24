(function ($) {
	// USE STRICT
	"use strict";

	$(document).ready(function () {
		const defaultPriceList = {
			uberX: {
				kmPrice: [8000, 12000, 10000],
				waitingPrice: 2000,
			},
			uberSUV: {
				kmPrice: [9000, 14000, 12000],
				waitingPrice: 3000,
			},
			uberBlack: {
				kmPrice: [10000, 16000, 14000],
				waitingPrice: 2000,
			},
		};

		let pay = $("#pay");
		let print = $("#print");
		$("input[type=radio]").change(function () {
			$("#xuatTien").text(0);
			$("#divThanhTien").hide();
		});

		$("#kmNumber").keyup(function () {
			$("#xuatTien").text(0);
			$("#divThanhTien").hide();
		});

		$("#waitingTime").keyup(function () {
			$("#xuatTien").text(0);
			$("#divThanhTien").hide();
		});

		const step = [1, 19, "infinity"];

		function checkData() {
			let typeCar = $("input[type=radio]:checked").get(0)?.id;
			if (!typeCar) {
				alert("vui lòng chọn loại xe");
				return undefined;
			}

			let kmNumber = $("#kmNumber").val();
			if (!kmNumber) {
				alert("vui lòng nhập số KM");
				return undefined;
			}

			if (!$.isNumeric(kmNumber)) {
				alert("nhập 'số KM' là số và lớn hơn hoặc bằng 0");
				return undefined;
			}

			if (kmNumber < 0) {
				alert("nhập 'số KM' là số và lớn hơn hoặc bằng 0");
				return undefined;
			}

			let waitingTime = $("#waitingTime").val();
			if (!waitingTime) {
				alert("vui lòng nhập thời gian chờ");
				return undefined;
			}

			if (!$.isNumeric(waitingTime)) {
				alert("nhập 'thời gian chờ' là số và lớn hơn hoặc bằng 0");
				return undefined;
			}

			if (waitingTime < 0) {
				alert("nhập 'thời gian chờ' là số và lớn hơn hoặc bằng 0");
				return undefined;
			}

			return {
				typeCar,
				kmNumber,
				waitingTime,
			};
		}

		function checkNumber(number, maxValue) {
			const minValue =
				maxValue === "infinity" ? number : Math.min(number, maxValue);
			return Math.max(minValue, 0);
		}

		function calc(data) {
			const kmNumber = data.kmNumber;
			const menuPrice = defaultPriceList[data.typeCar];
			let total = 0;
			let stepSub = 0;
			const result = [];

			step.forEach((v, index) => {
				const km = checkNumber(kmNumber - stepSub, v);
				if (km > 0) {
					const res = km * menuPrice.kmPrice[index];

					result.push({
						key: data.typeCar,
						value: `${km} km`,
						price: menuPrice.kmPrice[index],
						res,
					});
					total += res;
				}
				stepSub += v !== "infinity" ? km : step[index];
			});

			if (data.waitingTime > 0) {
				const res = data.waitingTime * menuPrice.waitingPrice;

				result.push({
					key: "Thời gian chờ",
					value: `${data.waitingTime} phút`,
					price: menuPrice.waitingPrice,
					res,
				});

				total += res;
			}
			return {
				details: result,
				total,
			};
		}

		function clear(key) {
			key.children().remove();
		}

		function renderBody(key, data) {
			data.details.map((v) =>
				key.append(
					`<tr>
					${Object.keys(v)
						.map((d) => `<td>${v[d]}</td>`)
						.join("\n")}
					</tr>`,
				),
			);

			key.append(
				`<tr class="rowTotal">
					<td scope="col">Total</td>
					<td></td>
					<td></td>
					<td>${data.total}</td>
				</tr>`,
			);
		}

		function renderTable(data) {
			const body = $("#renderBody");
			clear(body);
			renderBody(body, data);
		}

		pay.click(function () {
			const data = checkData();
			if (data) {
				const result = calc(data);
				$("#xuatTien").text(result.total);
				$("#divThanhTien").show();
			}
		});

		print.click(function () {
			const data = checkData();
			if (data) {
				$("#exampleModal").modal({
					show: true,
				});
				renderTable(calc(data));
			}
		});
	});
})(jQuery);
