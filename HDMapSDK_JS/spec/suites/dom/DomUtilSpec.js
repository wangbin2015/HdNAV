describe('DomUtil', function () {
	var el;

	beforeEach(function () {
		el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.top = el.style.left = '-10000px';
		document.body.appendChild(el);
	});

	afterEach(function () {
		document.body.removeChild(el);
	});

	describe('#get', function () {
		it('gets element by id if the given argument is string', function () {
			el.id = 'testId';
			expect(HDMap.DomUtil.get(el.id)).to.eql(el);
		});

		it('returns the element if it is given as an argument', function () {
			expect(HDMap.DomUtil.get(el)).to.eql(el);
		});
	});

	describe('#addClass, #removeClass, #hasClass', function () {
		it('has defined class for test element', function () {
			el.className = 'bar foo baz ';
			expect(HDMap.DomUtil.hasClass(el, 'foo')).to.be.ok();
			expect(HDMap.DomUtil.hasClass(el, 'bar')).to.be.ok();
			expect(HDMap.DomUtil.hasClass(el, 'baz')).to.be.ok();
			expect(HDMap.DomUtil.hasClass(el, 'boo')).to.not.be.ok();
		});

		it('adds or removes the class', function () {
			el.className = '';
			HDMap.DomUtil.addClass(el, 'foo');

			expect(el.className).to.eql('foo');
			expect(HDMap.DomUtil.hasClass(el, 'foo')).to.be.ok();

			HDMap.DomUtil.addClass(el, 'bar');
			expect(el.className).to.eql('foo bar');
			expect(HDMap.DomUtil.hasClass(el, 'foo')).to.be.ok();

			HDMap.DomUtil.removeClass(el, 'foo');
			expect(el.className).to.eql('bar');
			expect(HDMap.DomUtil.hasClass(el, 'foo')).to.not.be.ok();

			el.className = 'foo bar barz';
			HDMap.DomUtil.removeClass(el, 'bar');
			expect(el.className).to.eql('foo barz');
		});
	});

	// describe('#setPosition', noSpecs);

	// describe('#getStyle', noSpecs);
});
