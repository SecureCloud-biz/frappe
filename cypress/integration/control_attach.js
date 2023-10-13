context("Attach Control", () => {
	before(() => {
		cy.login();
		cy.visit("/app/doctype");
		return cy
			.window()
			.its("frappe")
			.then((frappe) => {
				return frappe.xcall("frappe.tests.ui_test_helpers.create_doctype", {
					name: "Test Attach Control",
					fields: [
						{
							label: "Attach File or Image",
							fieldname: "attach",
							fieldtype: "Attach",
							in_list_view: 1,
						},
					],
				});
			});
	});
	it('Checking that "Camera" button in the "Attach" fieldtype does show if camera is available', () => {
		//Navigating to the new form for the newly created doctype
		let doctype = "Test Attach Control";
		let dt_in_route = doctype.toLowerCase().replace(/ /g, "-");
		cy.visit(`/app/${dt_in_route}/new`, {
			onBeforeLoad(win) {
				// Mock "window.navigator.mediaDevices" property
				// to return mock mediaDevices object
				win.navigator.mediaDevices = {
					ondevicechange: null,
				};
			},
		});
		cy.get("body").should("have.attr", "data-route", `Form/${doctype}/new-${dt_in_route}-1`);
		cy.get("body").should("have.attr", "data-ajax-state", "complete");

		//Clicking on the attach button which is displayed as part of creating a doctype with "Attach" fieldtype
		cy.findByRole("button", { name: "Attach" }).click();

		//Clicking on "Camera" button
		cy.findByRole("button", { name: "Camera" }).should("exist");
	});

	it('Checking that "Camera" button in the "Attach" fieldtype does not show if no camera is available', () => {
		//Navigating to the new form for the newly created doctype
		let doctype = "Test Attach Control";
		let dt_in_route = doctype.toLowerCase().replace(/ /g, "-");
		cy.visit(`/app/${dt_in_route}/new`, {
			onBeforeLoad(win) {
				// Delete "window.navigator.mediaDevices" property
				delete win.navigator.mediaDevices;
			},
		});
		cy.get("body").should("have.attr", "data-route", `Form/${doctype}/new-${dt_in_route}-1`);
		cy.get("body").should("have.attr", "data-ajax-state", "complete");

		//Clicking on the attach button which is displayed as part of creating a doctype with "Attach" fieldtype
		cy.findByRole("button", { name: "Attach" }).click();

		//Clicking on "Camera" button
		cy.findByRole("button", { name: "Camera" }).should("not.exist");
	});
});
