module.exports = {
  /**
   * Give all terms the given tag
   *
   * @param {string} tag - a pos tag
   * @param {string=} why - a rationale to help debugging
   */
  tag: function(tag, why) {
    this.list.forEach(p => {
      p.terms().forEach(t => t.tag(tag, why, this.world));
    });
    return this;
  },
  /**
   * Remove this term from the given terms
   *
   * @param {string} tag - a pos tag
   * @param {string=} why - a rationale to help debugging
   */
  untag: function(tag, why) {
    this.list.forEach(p => {
      p.terms().forEach(t => t.unTag(tag, why, this.world));
    });
    return this;
  },
  /** turn on logging for decision-debugging */
  verbose: function(bool) {
    if (bool === undefined) {
      bool = true;
    }
    this.world.verbose = bool;
  },
  /** create a Doc from the first Term of each phrase */
  term: function(n) {
    let list = this.list.map(p => {
      let term = p.terms(n);
      return p.buildFrom([term]);
    });
    return this.buildFrom(list);
  },
  /** create a Doc from the first Term of each phrase */
  firstTerm: function() {
    let list = this.list.map(p => {
      let term = p.terms(0);
      return p.buildFrom([term]);
    });
    return this.buildFrom(list);
  },
  /** create a Doc from the last Term of each phrase */
  lastTerm: function() {
    let list = this.list.map(p => {
      let term = p.lastTerm();
      return p.buildFrom([term]);
    });
    return this.buildFrom(list);
  },
};
