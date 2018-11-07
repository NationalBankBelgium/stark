import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TableOfContentsComponent } from "./table-of-contents.component";
import { TableOfContentLink } from "./table-of-content-link.intf";

describe("TableOfContents", () => {
	let fixture: ComponentFixture<TableOfContentsComponent>;
	let component: TableOfContentsComponent;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [TableOfContentsComponent],
			imports: []
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TableOfContentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should have no header", () => {
		const header: Element = fixture.nativeElement.querySelector("h2");
		expect(header).toBeNull();
	});

	it("should scroll to the right position", () => {
		component.links = [
			{
				type: "h2",
				id: "test",
				name: "test",
				top: 52,
				active: false
			}
		];

		fixture.detectChanges();
		const myAnchor: string = component.links[0].id;
		spyOn(document, "querySelector").and.returnValue(document);

		component.scrollToAnchor(myAnchor);
		const pos: number = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
		expect(pos).toBe(52);
	});

	it("should have header and links", () => {
		component.links = [
			{
				type: "h2",
				id: "test",
				name: "test",
				top: 0,
				active: false
			}
		];

		const header: Element = fixture.nativeElement.querySelector("h2");
		expect(header).toBeDefined();

		const links: Element = fixture.nativeElement.querySelector("li");
		expect(links).toBeDefined();
	});

	it("should have created links", () => {
		let links: TableOfContentLink[];
		fixture.detectChanges();
		const headerSelector: Partial<HTMLElement>[] = [
			{ innerText: "first link", offsetTop: 25, tagName: "FIRST", id: "1" },
			{ innerText: "second link", offsetTop: 50, tagName: "SECOND", id: "2" }
		];

		spyOn(document, "querySelectorAll").and.returnValue(headerSelector);

		const expectedFirstLink: TableOfContentLink = { name: "first link", type: "first", top: 5, id: "1", active: false };
		const expectedSecondLink: TableOfContentLink = { name: "second link", type: "second", top: 30, id: "2", active: false };

		links = component.createLinks();
		expect(links).not.toBeNull();
		expect(links.length).toBe(2);
		expect(links[0]).toEqual(expectedFirstLink);
		expect(links[1]).toEqual(expectedSecondLink);
	});
});
