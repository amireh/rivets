describe("Rivets.observer", function() {
  it("should unbind all change events on unobserve", function() {
    var model = {
      a: {
        b: {
          c: 'foo'
        }
      }
    };

    var called_count = 0;

    var obs = new rivets._.Observer(rivets, model, 'a.b.c', function() {
      called_count += 1;
    });

    model.a.b.c = 'bar';
    expect(called_count).toBe(1);

    obs.unobserve();

    model.a.b.c = 'baz';
    expect(called_count).toBe(1);
  });

  describe('suite', function() {
    var originalAdapter, nrSubscriptions;

    beforeEach(function() {
      nrSubscriptions = 0;
      originalAdapter = rivets.adapters[':'];
      var newAdapter = {
        subscribe: function(obj, keypath, callback) {
          console.debug('Subscribed to:', keypath);
          ++nrSubscriptions;
        },

        unsubscribe: function(obj, keypath, callback) {
          console.debug('Unsubscribed from:', keypath);
          --nrSubscriptions;
        },

        read: function(obj, keypath) {
          return obj[keypath];
        },

        publish: function(obj, keypath, value) {
          obj[keypath] = value;
        }
      };

      rivets.adapters[':'] = newAdapter;
    });

    afterEach(function() {
      rivets.adapters[':'] = originalAdapter;
    });

    it('should unsubscribe for each subscribed keypath', function() {
      var el = document.createElement('div');
      el.innerHTML = '<ul><li rv-each-item="items">{ :item }</li></ul>';
      var view = rivets.bind(el, {});

      view.update({ items: [ 'A', 'B', 'C' ] });
      expect(nrSubscriptions).toEqual(3);

      view.unbind();
      expect(nrSubscriptions).toEqual(0); // fails

      view.bind();
      expect(nrSubscriptions).toEqual(3);

      // view.update({ items: [ 'A', 'B', 'C', 'D' ] });
      // expect(nrSubscriptions).toEqual(4);

      // view.unbind();
      // expect(nrSubscriptions).toEqual(0);
    });
  });

});
